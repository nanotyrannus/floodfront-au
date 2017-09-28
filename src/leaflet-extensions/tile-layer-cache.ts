declare let L: any
declare let window: any
import { Observable, Subject } from "rx"
import { EventAggregator } from "aurelia-event-aggregator"
import { autoinject } from "aurelia-framework"

@autoinject
export class TileLayerCache {
    saveToCache: any;
    useOnlyCache: any;
    cacheFormat: any;
    cacheMaxAge: any;
    useCache: boolean;

    private db: PouchDB.Database<any>

    constructor(public ea: EventAggregator) {
        this.ea.subscribe('tilecache', evt => {
            if (evt.hit) {
                console.log(`Cache  HIT!`)
            } else {
                console.log(`Cache MISS!`)
            }
        })
        this.db = new PouchDB('offline-tiles')
        L.TileLayer.addInitHook(function (db, ea) {
            return function () {

                // if (!this.options.useCache) {
                //     this._db = null;
                //     this._canvas = null;
                //     return;
                // }

                // this._db = new PouchDB('offline-tiles');
                this._db = db
                this._ea = ea
                window.db = this._db
                this._canvas = document.createElement('canvas');

                if (!(this._canvas.getContext && this._canvas.getContext('2d'))) {
                    // HTML5 canvas is needed to pack the tiles as base64 data. If
                    //   the browser doesn't support canvas, the code will forcefully
                    //   skip caching the tiles.
                    this._canvas = null;
                }
            }
        }(this.db, this.ea))

        // 🍂namespace TileLayer
        // 🍂section PouchDB tile caching options
        // 🍂option useCache: Boolean = false
        // Whether to use a PouchDB cache on this tile layer, or not
        L.TileLayer.prototype.options.useCache = false;
        this.useCache = false

        // 🍂option saveToCache: Boolean = true
        // When caching is enabled, whether to save new tiles to the cache or not
        L.TileLayer.prototype.options.saveToCache = true;
        this.saveToCache = true

        // 🍂option useOnlyCache: Boolean = false
        // When caching is enabled, whether to request new tiles from the network or not
        L.TileLayer.prototype.options.useOnlyCache = false;
        this.useOnlyCache = false

        // 🍂option useCache: String = 'image/png'
        // The image format to be used when saving the tile images in the cache
        L.TileLayer.prototype.options.cacheFormat = 'image/jpg';
        this.cacheFormat = 'image/jpg'

        // 🍂option cacheMaxAge: Number = 24*3600*1000
        // Maximum age of the cache, in milliseconds
        L.TileLayer.prototype.options.cacheMaxAge = 24 * 3600 * 1000;
        this.cacheMaxAge = 24 * 3600 * 1000

        L.TileLayer.include({

            // Overwrites L.TileLayer.prototype.createTile
            createTile: function (coords, done) {
                var tile = document.createElement('img');

                tile.onerror = L.bind(this._tileOnError, this, done, tile);

                if (this.options.crossOrigin) {
                    tile.crossOrigin = '';
                }

                /*
                 Alt tag is *set to empty string to keep screen readers from reading URL and for compliance reasons
                 http://www.w3.org/TR/WCAG20-TECHS/H67
                 */
                tile.alt = '';

                var tileUrl = this.getTileUrl(coords);

                // if (this.options.useCach && this._canvas) {
                if (this._canvas) {
                    this._db.get(tileUrl, { revs_info: true }, this._onCacheLookup(tile, tileUrl, done));
                } else {
                    // Fall back to standard behaviour
                    tile.onload = L.bind(this._tileOnLoad, this, done, tile);
                }

                tile.src = tileUrl;
                return tile;
            },

            // Returns a callback (closure over tile/key/originalSrc) to be run when the DB
            //   backend is finished with a fetch operation.
            _onCacheLookup: function (tile, tileUrl, done) {
                return function (err, data) {
                    if (data) {
                        this.fire('tilecachehit', {
                            tile: tile,
                            url: tileUrl
                        });
                        if (Date.now() > data.timestamp + this.options.cacheMaxAge && !this.options.useOnlyCache) {
                            // Tile is too old, try to refresh it
                            //console.log('Tile is too old: ', tileUrl);

                            if (this.options.saveToCache) {
                                tile.onload = L.bind(this._saveTile, this, tile, tileUrl, data._revs_info[0].rev, done);
                            }
                            tile.crossOrigin = 'Anonymous';
                            tile.src = tileUrl;
                            tile.onerror = function (ev) {
                                // If the tile is too old but couldn't be fetched from the network,
                                //   serve the one still in cache.
                                console.warn("Error from tile.onerror!")
                                this.src = data.dataUrl;
                            }
                        } else {
                            // Serve tile from cached data
                            //console.log('Tile is cached: ', tileUrl);
                            tile.onload = L.bind(this._tileOnLoad, this, done, tile);
                            tile.src = data.dataUrl;    // data.dataUrl is already a base64-encoded PNG image.
                        }
                    } else {
                        this.fire('tilecachemiss', {
                            tile: tile,
                            url: tileUrl
                        });
                        if (this.options.useOnlyCache) {
                            // Offline, not cached
                            // 					console.log('Tile not in cache', tileUrl);
                            tile.onload = L.Util.falseFn;
                            tile.src = L.Util.emptyImageUrl;
                        } else {
                            //Online, not cached, request the tile normally
                            // 					console.log('Requesting tile normally', tileUrl);
                            if (this.options.saveToCache) {
                                tile.onload = L.bind(this._saveTile, this, tile, tileUrl, null, done);
                            } else {
                                tile.onload = L.bind(this._tileOnLoad, this, done, tile);
                            }
                            tile.crossOrigin = 'Anonymous';
                            tile.src = tileUrl;
                        }
                    }
                }.bind(this);
            },

            // Returns an event handler (closure over DB key), which runs
            //   when the tile (which is an <img>) is ready.
            // The handler will delete the document from pouchDB if an existing revision is passed.
            //   This will keep just the latest valid copy of the image in the cache.
            _saveTile: function (tile, tileUrl, existingRevision, done) {
                if (this._canvas === null) return;
                this._canvas.width = tile.naturalWidth || tile.width;
                this._canvas.height = tile.naturalHeight || tile.height;

                var context = this._canvas.getContext('2d');
                context.drawImage(tile, 0, 0);

                var dataUrl;
                try {
                    dataUrl = this._canvas.toDataURL(this.options.cacheFormat);
                } catch (err) {
                    this.fire('tilecacheerror', { tile: tile, error: err });
                    return done();
                }
                var doc = { dataUrl: dataUrl, timestamp: Date.now() };

                if (existingRevision) {
                    this._db.remove(tileUrl, existingRevision);
                }

                let failed = false
                let attempts = 3

                do {
                    this._db.put({
                        _id: tileUrl,
                        dataUrl: dataUrl,
                        timestamp: doc.timestamp
                    }, (err, response) => {
                        if (err) {
                            console.error(err)
                            failed = true
                            attempts--
                        }
                    })
                } while (failed && (attempts > 0))

                if (done) { done(); }
            },

            // 🍂section PouchDB tile caching options
            // 🍂method seed(bbox: LatLngBounds, minZoom: Number, maxZoom: Number): this
            // Starts seeding the cache given a bounding box and the minimum/maximum zoom levels
            // Use with care! This can spawn thousands of requests and flood tileservers!
            seed: function (bbox, minZoom, maxZoom) {
                // if (!this.options.useCache) return;
                if (minZoom > maxZoom) return;
                if (!this._map) return;

                var queue = [];

                let ne = bbox.getNorthEast()
                let nw = bbox.getNorthWest()
                let sw = bbox.getSouthWest()
                let se = bbox.getSouthEast()

                this._seedingArea = [[[ne.lng, ne.lat], [nw.lng, nw.lat], [sw.lng, sw.lat], [se.lng, se.lat], [ne.lng, ne.lat]]]


                for (var z = minZoom; z <= maxZoom; z++) {

                    var northEastPoint = this._map.project(bbox.getNorthEast(), z);
                    var southWestPoint = this._map.project(bbox.getSouthWest(), z);

                    // Calculate tile indexes as per L.TileLayer._update and
                    //   L.TileLayer._addTilesFromCenterOut
                    var tileSize = this.getTileSize();
                    var tileBounds = L.bounds(
                        L.point(Math.floor(northEastPoint.x / tileSize.x), Math.floor(northEastPoint.y / tileSize.y)),
                        L.point(Math.floor(southWestPoint.x / tileSize.x), Math.floor(southWestPoint.y / tileSize.y)));

                    for (var j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
                        for (var i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
                            let point = new L.Point(i, j);
                            point.z = z;
                            queue.push(this._getTileUrl(point));
                        }
                    }
                }

                var seedData = {
                    bbox: bbox,
                    minZoom: minZoom,
                    maxZoom: maxZoom,
                    queueLength: queue.length
                }
                this.fire('seedstart', seedData);
                var tile = this._createTile();
                tile._layer = this;
                // this._seedOneTile(tile, queue, seedData);
                // let tiles = Observable.from(queue)
                // let buffer = tiles.bufferWithCount(5)
                // buffer.subscribe(val => {
                //     console.log("seed", val)
                // })
                // Observable.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
                //     .bufferWithCount(2).map(val => { return Observable.return(val).delay(1000) })
                //     .concatAll()
                //     .subscribe(val => { console.log(`from delay: ${val}`) })
                async function getTile() { }

                console.log(`Tiles in area: ${queue.length}`)
                this._seedAll(queue)
                return this;
            },
            _delay: async function (msecs) {
                return new Promise((res, rej) => {
                    setTimeout(() => {
                        res()
                    }, msecs)
                })
            },

            _seedingInProgress: false,
            _seedingTotal: 0,
            _seedingCurrent: 0,
            _seedingArea: null,

            _onSeedingDone: function () {
                this._seedingInProgress = false
                this._seedingTotal = 0
                this._seedingCurrent = 0
                this._ea.publish('loading-indicator', false)
                this._ea.publish('tilecache-area', { polygon: this._seedingArea })
            },

            _seedAll: function (tileUrls) {
                if (this._seedingInProgress) {
                    console.warn("Already seeding!")
                    return
                }

                this._seedingTotal = tileUrls.length
                this._seedingInProgress = true

                // let getAsObservable =  Observable.fromNodeCallback(this.db.get)

                // Observable.from(tileUrls)
                // .subscribe((result: any) => { console.log("FOUND      ", result._id) }, (error: any) => {console.warn("NOT FOUND", error)})

                this._seedingTotal = 0

                Observable.from(tileUrls)
                    .flatMap(url => {
                        // Interested in URLs that are not in DB
                        // So, no-op on cache hit and return urls
                        // that cause throws.
                        return Observable.fromPromise(this._db.get(url))
                            .flatMap(() => {
                                console.log("Cache  HIT")
                                return Observable.empty()
                            })
                            .catch(error => {
                                console.warn("Cache MISS")
                                if (error.name !== "not_found") {
                                    console.error("SOMETHING WRONG", error)
                                }
                                return Observable.just(url)
                            })
                    })
                    .toArray()
                    .subscribe(result => {
                        // Coalesce DB results into array before
                        // beginning cache operation.
                        this._seedingTotal = result.length
                        console.log(`Tiles needed to cache: ${result.length}`)
                        if (result.length === 0) {
                            return this._onSeedingDone()
                        }
                        Observable.fromArray(result)
                            .bufferWithCount(10)
                            .zip(Observable.timer(0, 1000), _ => _)
                            .subscribe(urls => {
                                urls.forEach((url: string) => {
                                    this._db.get(url, (err, data) => {
                                        // if (!data) {
                                        let tile = document.createElement('img')
                                        tile.onload = function (evt) {
                                            this._saveTile(tile, url, null)
                                            this._seedingCurrent++
                                            this._ea.publish('loading-indicator-progress', Math.ceil(this._seedingCurrent / this._seedingTotal * 100))
                                            if (this._seedingCurrent === this._seedingTotal) {
                                                console.log(`Seeding complete.`)
                                                this._onSeedingDone()
                                            } else {
                                                console.log(`PROGRESS: ${this._seedingCurrent} out of ${this._seedingTotal} tiles cached`)
                                            }
                                        }.bind(this)
                                        tile.crossOrigin = 'Anonymous'
                                        tile.src = url
                                        // } else {
                                        //     console.warn(`This shouldn't pop up since all non-cached urls are filtered out.`, data)
                                        // }
                                    })
                                })
                            },
                            exception => {
                                console.warn(exception)
                                this._onSeedingDone()
                            },
                            () => {
                                console.log("Seed stream end.")
                            })
                    })

                // tileUrls.forEach(async function (url, i) {
                //     try {
                //         let data = await this._db.get(url)
                //         this._seedingCurrent++
                //         console.log(`Saved (hit): ${(this._seedingCurrent/this._seedingTotal)*60}%`)
                //         if (this._seedingTotal === this._seedingCurrent) {
                //             this._onSeedingDone()
                //         }
                //     } catch (err) {
                //         await this._delay(i*15)
                //         var tile = document.createElement('img')
                //         tile.onload = function (evt) {
                //             this._saveTile(tile, url, null)
                //             this._seedingCurrent++
                //             console.log(`Saved (miss): ${(this._seedingCurrent/this._seedingTotal)*100}%`)
                //             if (this._seedingTotal === this._seedingCurrent) {
                //                 this._onSeedingDone()
                //             }
                //         }.bind(this)
                //         tile.crossOrigin = 'Anonymous'
                //         tile.src = url
                //     }

                // this._db.get(url, function (err, data) {
                //     if (!data) {
                //         /// FIXME: Do something on tile error!!
                //         tile.onload = function (ev) {
                //             this._saveTile(tile, url, null); //(ev)
                //         }.bind(this);
                //         tile.crossOrigin = 'Anonymous';
                //         tile.src = url;
                //     } else {

                //     }
                // }.bind(this));
                // }.bind(this))

            },
            _createTile: function () {
                return document.createElement('img');
            },

            // Modified L.TileLayer.getTileUrl, this will use the zoom given by the parameter coords
            //  instead of the maps current zoomlevel.
            _getTileUrl: function (coords) {
                var zoom = coords.z;
                if (this.options.zoomReverse) {
                    zoom = this.options.maxZoom - zoom;
                }
                zoom += this.options.zoomOffset;
                return L.Util.template(this._url, L.extend({
                    r: this.options.detectRetina && L.Browser.retina && this.options.maxZoom > 0 ? '@2x' : '',
                    s: this._getSubdomain(coords),
                    x: coords.x,
                    y: this.options.tms ? this._globalTileRange.max.y - coords.y : coords.y,
                    z: this.options.maxNativeZoom ? Math.min(zoom, this.options.maxNativeZoom) : zoom
                }, this.options));
            },

            // Uses a defined tile to eat through one item in the queue and
            //   asynchronously recursively call itself when the tile has
            //   finished loading.
            _seedOneTile: function (tile, remaining, seedData) {
                if (!remaining.length) {
                    this.fire('seedend', seedData);
                    return;
                }
                this.fire('seedprogress', {
                    bbox: seedData.bbox,
                    minZoom: seedData.minZoom,
                    maxZoom: seedData.maxZoom,
                    queueLength: seedData.queueLength,
                    remainingLength: remaining.length
                });

                var url = remaining.pop();
                console.log(`seeding: ${url}`)

                this._db.get(url, function (err, data) {
                    if (!data) {
                        /// FIXME: Do something on tile error!!
                        tile.onload = function (ev) {
                            this._saveTile(tile, url, null); //(ev)
                            this._seedOneTile(tile, remaining, seedData);
                            console.log(`saved: ${url}`)
                        }.bind(this);
                        tile.crossOrigin = 'Anonymous';
                        tile.src = url;
                    } else {
                        console.log(`already saved: ${url}`)
                        this._seedOneTile(tile, remaining, seedData);
                    }
                }.bind(this));

            },

            clearCache: function () {
                console.log(`clearcache`)
                this._db.destroy().then(res => {
                    console.log(`db.destroy`, res)
                    this._db = new PouchDB('offline-tiles')
                }).catch(err => {
                    console.error(`db.destroy`, err)
                })
            }

        });

    }

}