import { Router } from "aurelia-router"
import { RestService } from "../rest/rest-service"
import { UserService } from "../user/user-service"
import { CookieService } from "../cookie/cookie-service"
import { autoinject } from "aurelia-framework"
import { MarkerModel, MarkerType } from "./MarkerModel"
import { Marker } from "leaflet"
import { MarkerNoteCustomElement } from "./marker-note/marker-note"
import { NavigationService } from "../navigation/navigation-service"
import { EventAggregator } from "aurelia-event-aggregator"
import { InformationCustomElement } from "../resources/elements/information"
import { SearchCustomElement } from "../resources/elements/search/search"
import { MatthewFilterCustomElement } from "../resources/elements/matthew-filter/matthew-filter"
import { SideMenuCustomElement } from "../resources/elements/side-menu/side-menu"
import { ModalDialogCustomElement } from "../resources/elements/modal-dialog/modal-dialog"
import { child } from "aurelia-framework"
import * as Hammer from "hammerjs"
import { TileLayerCache } from "../leaflet-extensions/tile-layer-cache"
import { polygon } from "../turf/helpers"
import { union } from "../turf/union"

@autoinject
export class LeafletMap {
    private leafletMap: L.Map
    private primed: boolean = false
    private selectedMarker: Marker
    private markerType: MarkerType
    private markers: Marker[]
    private markersModels: MarkerModel[]
    private files: Map<any, File> = new Map<any, File>()
    private placeQuery: string
    private searchText = "Search text"
    private isSatelliteLayer: boolean
    private simpleLayer: any
    private satelliteLayer: any
    private cachedAreas: Array<Array<number>>
    private cachedAreaPolygon: L.LayerGroup
    @child('information') private info: InformationCustomElement
    @child('search') private search: SearchCustomElement
    @child('matthew-filter') private matthew: MatthewFilterCustomElement

    constructor(
        private cache: TileLayerCache,
        private router: Router,
        private rest: RestService,
        private userService: UserService,
        private markerNote: MarkerNoteCustomElement,
        // private info: InformationCustomElement,
        private eventAggregator: EventAggregator,
        private nav: NavigationService,
        private cookie: CookieService) {


        this.eventAggregator.subscribe("marker-note", data => {
            console.log(data)
            this.markersModels.forEach(markerModel => {
                if (markerModel.id === data.id) {
                    //TODO update descriptions client-side
                }
            })
        })

        this.eventAggregator.subscribe('search-event', () => {
            this.showSearch()
        })

        this.eventAggregator.subscribe('cache-event', which => {
            if (which === "seed") {
                this.seedMap()
            } else if (which === "clear") {
                this.clearCache()
            }

        })

        this.cachedAreas = new Array<Array<number>>()


        this.cachedAreaPolygon = new L.LayerGroup([L.polygon([[0, 0]])])
        this.eventAggregator.subscribe('tilecache-area', evt => {
            this.cachedAreas.push(evt.polygon)
            let polygons = []
            this.cachedAreas.forEach(latlng => {
                polygons.push(polygon(latlng))
            })
            this.cachedAreaPolygon.clearLayers()
            let reduced = union(...polygons)
            let unioned = L.geoJSON(reduced, { style: function () { return { color: "#ff0083", fillOpacity: 0, opacity: 0.6 } } })
            this.cachedAreaPolygon.addLayer(unioned)
            this.cachedAreaPolygon.addTo(this.leafletMap)
        })

        this.getMarkers()
    }

    attached() {
        if (!this.userService.email) {
            this.router.navigate("")
            return
        }

        window['leafletComponent'] = {
            "upload": (id) => this.upload(id),
            "openNote": () => {
                this.markerNote.open((this.selectedMarker as DataMarker).id)
            },
            "closeNote": () => {
                this.markerNote.close()
            },
            "readUrl": (val, id) => this.readUrl(val, id),
            "deleteMarker": () => {
                this.deleteMarker(this.selectedMarker)
            }
        }

        if (!this.cookie.get("last_location")) {
            this.cookie.set("last_location", JSON.stringify({ "lat": 34.2049, "lng": -118.1641 }))
            this.centerMap()
        }

        if (!this.cookie.get("last_zoom_level")) {
            this.cookie.set("last_zoom_level", "18")
        }

        this.nav.initialize()
        this.configureMap()

        var hammer = new Hammer(window.document.body)
        hammer.on('swipeleft', () => {
            this.eventAggregator.publish('swipe-event', "left")
        })

        hammer.on('swiperight', (e) => {
            var endPoint = e.pointers[0].pageX;
            var distance = e.distance;
            var origin = endPoint - distance;
            if (origin <= 30) {
                this.eventAggregator.publish('swipe-event', "right")
            }
        })
        hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL })
    }

    private spawnMarker(latlng: any, type: MarkerType = null, oldMarker: any = null) {
        console.log(`spawnMarker called with ${latlng}`)
        let marker: any = L.marker(latlng, { "draggable": true })

        var delay = 250
        marker.clickCount = 0
        marker.on('click', event => {
            console.log(marker.id)
            // Implement double click
            this.selectedMarker = marker
            marker.clickCount += 1
            if (marker.clickCount === 2) {
                console.log("Double click detected.")
            }
            setTimeout(() => {
                if (marker.clickCount === 1) {
                    console.log("Single click detected")
                }
                marker.clickCount = 0
            }, delay)

            setTimeout(() => {
                // Wait one tick for popup to render
                $(":file").filestyle({
                    iconName: "glyphicon glyphicon-camera",
                    input: false,
                    buttonText: "Photo"
                })
                $("div.bootstrap-filestyle.input-group").css("width", "100%")
                $("label.btn.btn-default").css("width", "100%")
            }, 0)
        })
        marker.on("contextmenu", event => {
            console.log(`contextmenu event from ${marker.id}`, event)
            this.selectedMarker = marker
            event.originalEvent.preventDefault()
            this.deleteMarker(marker)

            // this.selectedMarker = marker
            // this.popup.setMarker(this.selectedMarker)
            // this.sliderDisplay = "block"
            // this.x = (event.originalEvent.clientX - this.sliderRadius - 20)
            // this.y = (event.originalEvent.clientY - this.sliderRadius - 20)
            // this.zone.run(() => {
            //   this.popup.setCoords(event.originalEvent.clientX, event.originalEvent.clientY)
            //   this.popup.show()
            // })

            // return false
        })

        if (oldMarker) { // Markers from server are not typed
            marker.id = oldMarker.id
            // if (oldMarker.heading !== null) {
            //   marker.type = MarkerType.DIRECTIONAL
            //   marker.setIcon(
            //     L.icon({
            //       "iconUrl": "assets/images/arrow.svg",
            //       "iconSize": [40, 40]
            //     })
            //   )
            //   marker.heading = oldMarker.heading
            //   marker.setRotationAngle(marker.heading)
            // } else {
            //   marker.type = MarkerType.DEFAULT
            // }
            console.log(`Marker of id ${oldMarker.id} retrieved of type ${oldMarker.marker_type}`)
        } else {
            // Newly created marker
            marker.marker_type = MarkerType[this.markerType]
            // if (marker.marker_type === MarkerType.DIRECTIONAL) {
            //     marker.heading = 0
            //     marker.setIcon(
            //         L.icon({
            //             "iconUrl": "assets/images/arrow.svg",
            //             "iconSize": [40, 40]
            //         })
            //     )
            //     // After rotation plugin install, set rotation here
            // }
            // marker.idSubject = new ReplaySubject(1)
            // marker.idSubject.subscribe(id => {
            //     marker.id = id
            //     this.bindPopup(marker)
            // })
            this.createMarker(latlng.lat, latlng.lng, marker, marker.marker_type)
        }

        let referenceMarker = (oldMarker) ? oldMarker : marker

        if (referenceMarker.marker_type === MarkerType[MarkerType.WALKABLE]) {
            marker.setIcon(
                L.icon({
                    "iconUrl": "assets/images/marker_walkable.svg",
                    "iconSize": [25, 25]
                })
            )
        } else if (referenceMarker.marker_type === MarkerType[MarkerType.BORDER]) {
            marker.setIcon(
                L.icon({
                    "iconUrl": "assets/images/marker_border.svg",
                    "iconSize": [25, 25]
                })
            )
        } else if (referenceMarker.marker_type === MarkerType[MarkerType.FLOOD]) {
            marker.setIcon(
                L.icon({
                    "iconUrl": "assets/images/marker_flood.svg",
                    "iconSize": [25, 25]
                })
            )
        } else {
            console.warn(`Marker type: ${referenceMarker.marker_type}`)
        }

        marker.on('dragend', e => {
            this.updateMarker(marker.id, e.target._latlng)
        })

        this.bindPopup(marker)
        marker.addTo(this.leafletMap)
    }

    private configureMap() {
        this.leafletMap = L.map("map", {
            "zoom": parseInt(this.cookie.get("last_zoom_level"), 10),
            "center": JSON.parse(this.cookie.get("last_location")),
            "doubleClickZoom": false
        })


        var matthewTileUrls = [
            "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161007aOblique/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161008aOblique/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161008bOblique/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161009aOblique/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161010aOblique/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161011_RGB/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161013_RGB/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161014_RGB/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161015_RGB/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161016_RGB/{z}/{x}/{y}.png"
        ]
        let matthewOptions = { tileSize: 256, minZoom: 1, maxZoom: 19, type: 'xyz' }

        let matthewTileLayers = matthewTileUrls.map(tileString => {
            return L.tileLayer(tileString, matthewOptions)
        })

        /**
         * BUG! When reloading the page on /map, this line works.
         * However, |this.matthew| is not defined when navigating
         * to this view from another view. Waiting until the next
         * process tick fixes this for some reason.
         */
        setTimeout(() => {
            this.matthew.init(matthewTileLayers, this.leafletMap)
        }, 0)

        let matthewLayer = L.layerGroup(matthewTileLayers).eachLayer(layer => {
            (layer as any).bringToFront()
        })

        let harveyTileLayer = L.tileLayer("https://stormscdn.ngs.noaa.gov/20170827-rgb/{z}/{x}/{y}", { tileSize: 256, minZoom: 1, maxZoom: 19, type: 'xyz' })
        let harveyLayer = L.layerGroup([harveyTileLayer])

        // L.control.layers(null, { "Matthew": matthewLayer }).addTo(this.leafletMap)
        let simpleLayer = L.tileLayer('https://api.mapbox.com/styles/v1/nanotyrannus/cj0kywrdm001n2smyhddxb7wb/tiles/256/{z}/{x}/{y}@2x?access_token={accessToken}', {
            // attribution: 'Map data &copy; OpenStreetMap contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 19,
            id: 'your.mapbox.project.id',
            accessToken: 'pk.eyJ1IjoibmFub3R5cmFubnVzIiwiYSI6ImNpcnJtMmNubDBpZTN0N25rZmMxaHg4ZHQifQ.vj7pif8Z4BVhbYs55s1tAw',
            // useCache: true,
            crossOrigin: true
        })

        let satelliteLayer = L.tileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg70?access_token={accessToken}', {
            // attribution: 'Map data &copy; OpenStreetMap contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 19,
            id: 'your.mapbox.project.id',
            accessToken: 'pk.eyJ1IjoibWVnYXByb3RvZG9uIiwiYSI6ImNqODAzd3VtbTF6OXMzM3M2b2FzemV0ZGQifQ.IODqCZYCvs2KPqfIcEaeGA',
            // accessToken: 'pk.eyJ1IjoibmFub3R5cmFubnVzIiwiYSI6ImNpcnJtMmNubDBpZTN0N25rZmMxaHg4ZHQifQ.vj7pif8Z4BVhbYs55s1tAw',
            // useCache: true,
            crossOrigin: true
        })

        // satelliteLayer.destroy()
        // satelliteLayer.on('tilecache-hit', ()=>{ console.log("tilecache hit")})
        // satelliteLayer.on('tilecache-miss', () => { console.log("tilecache miss")})

        let baseMaps = {
            "Map": simpleLayer,
            "Satellite": satelliteLayer
        }

        let overlayMaps = {
            "Matthew": matthewLayer,
            "Harvey": harveyLayer
        }
        if (this.userService.mode === "desktop") {
            simpleLayer.addTo(this.leafletMap)
            matthewLayer.addTo(this.leafletMap)
            harveyLayer.addTo(this.leafletMap)
        } else {
            satelliteLayer.addTo(this.leafletMap)
        }

        this.simpleLayer = simpleLayer
        this.satelliteLayer = satelliteLayer

        this.leafletMap.addLayer(this.satelliteLayer)
        this.isSatelliteLayer = true
        if (this.userService.mode === "desktop") {
            this.toggleBaseMap()
            // this.isSatelliteLayer = false
        }

        // L.control.layers(baseMaps).addTo(this.leafletMap)

        // this.initiateNavigation

        this.leafletMap.on("tilecachehit", event => {
            console.warn("Cache hit!")
        })

        this.leafletMap.on("tilecachemiss", event => {
            console.warn("Cache miss!")
        })

        this.leafletMap.on("moveend", event => {
            // console.log(`moveend event`, event)
            let bbox = this.leafletMap.getBounds()
            let sw = bbox.getSouthWest()
            let se = bbox.getSouthEast()
            let ne = bbox.getNorthEast()
            let nw = bbox.getNorthWest()
            let width = this.leafletMap.distance(sw, se) / 1000
            let height = this.leafletMap.distance(ne, se) / 1000
            console.log(`Zoom level: ${event.target._zoom}, area: ${width * height} km^2`)
            this.cookie.set("last_location", JSON.stringify(this.getCenter()))
        })
        this.leafletMap.on("dragstart", event => {
            // this.popup.hide()
            // this.popup.isVisible = false
            console.log("dragstart")
        })

        this.leafletMap.on("dragend", (event) => {
            let center = this.getCenter()
            // this.cookie.set("last_location", JSON.stringify((<any>this.leafletMap).getBounds()._northEast))
            this.cookie.set("last_location", JSON.stringify(center))
        })

        this.leafletMap.on("zoomend", (event: any) => {
            this.cookie.set("last_zoom_level", `${this.leafletMap.getZoom()}`)
        })

        this.leafletMap.on('click', (event: any) => {

            if (this.primed) {
                this.primed = false
            } else {
                return
            }

            this.spawnMarker(event.latlng)

            console.log(`placed marker at ${event.latlng.lat}, ${event.latlng.lng}`)

            // marker.addTo(this.leafletMap)
        })

        // Search service listen
        this.eventAggregator.subscribe("search-select", (latlng: L.LatLng) => {
            console.log(`LeafletMap received search-selct`, latlng)
            this.leafletMap.setView(latlng, 18)
        })
    }

    goBack() {
        this.router.navigate("mode")
    }

    private getCenter(): L.LatLng {
        let bounds: any = this.leafletMap.getBounds()
        let center = L.latLng((bounds._northEast.lat + bounds._southWest.lat) / 2, (bounds._northEast.lng + bounds._southWest.lng) / 2)
        return center
    }

    private async getMarkers() {
        // Must remove magic number '2'
        let data = await this.rest.postWithRetry("marker/2/retrieve", { "email": this.userService.email })
        console.log("Markers!", data)
        data.markers.forEach((marker: MarkerModel) => {
            this.spawnMarker([marker.lat, marker.lon], marker.marker_type, marker)
        })
    }

    private primeMarker(type: string) {
        this.markerType = MarkerType[type]
        this.primed = true
    }

    private markerPlaced() {
        this.markerType = null
        this.primed = false
    }

    public async createMarker(lat: number, lon: number, marker: any = null, type: MarkerType = null) {
        let payload = {
            "type": type, //ignored on backend TODO: implementing type on backend
            "lat": lat,
            "lon": lon,
            "heading": (marker.heading != null) ? marker.heading : null,
            "accuracy": this.nav.currentPosition.accuracy || -1,
            "email": this.userService.email
        }
        console.log("createMarker payload", payload)
        let response = await this.rest.postWithRetry(`marker/2`, payload)
        // let data = response.content
        console.log("leaflet-map#createMarker", response)
        marker.id = response.id
        marker.unbindPopup()
        this.bindPopup(marker, type)
    }

    public bindPopup(marker: any, type: MarkerType = MarkerType.WALKABLE) {
        console.log(`leafletMap#bindPopup: ${marker.id}`)
        marker.unbindPopup()
        let id = marker.id
        let markup = `
        <img id="thumbnail-${marker.id}" class="thumbnail map-thumbnail" src="/uploads/${marker.id}.jpg">
        <form enctype="multipart/form-data" action="https://localhost:8080/upload" method="POST">
        <input style="display: inline;" class="filestyle" data-iconName="glyphicon glyphicon-camera" type="file" name="picture" accept="image/*" onchange="window.leafletComponent.readUrl(this, ${marker.id})">
        </form>
        <button class="btn btn-default context-btn" onclick="window.leafletComponent.openNote()">Note</button>
        <button class="btn btn-default context-btn" onclick="window.leafletComponent.deleteMarker()">Delete</button>
        <button class="btn btn-default" onclick="window.leafletComponent.upload(${marker.id})">UPLOAD</button>
    `
        // if (marker.type === MarkerType.DIRECTIONAL) {
        //   markup += `<div>I'M DIRECTIONAL</div>`
        // }
        marker.bindPopup(markup, { "autoPan": false })
    }

    public updateMarker(id: number, latlng: any, heading: number = null) {
        let callString = `marker/${id}/update`
        console.log(`updateMarker called with ${id} ${heading}`, latlng)
        console.log(`Call string: ${callString}`)
        this.rest.postWithRetry(callString, {
            "lat": latlng.lat,
            "lon": latlng.lng,
            "heading": heading
        })
    }

    private async deleteMarker(marker: Marker) {
        let res = window.confirm("Delete marker?")
        if (res) {
            this.leafletMap.removeLayer(marker)
            this.rest.postWithRetry(`marker/${(marker as DataMarker).id}/delete`, {})
        }
    }

    public readUrl(value: any, markerId: number) {
        console.log(value)
        var elm = document.getElementById(`thumbnail-${markerId}`)
        var reader = new FileReader() //
        reader.onload = e => {
            elm['src'] = e.target['result']
        }
        reader.readAsDataURL(value.files[0])
        this.files.set(markerId, value.files[0])
        // this.upload(markerId)
    }

    public seedMap() {
        this.satelliteLayer.seed(this.leafletMap.getBounds(), 10, 19)
        // this.satelliteLayer.on('seedstart', event => {
        //     console.log("seedstart", event)
        // })
        // this.satelliteLayer.on('seedend', event => {
        //     console.log("seedend", event)
        // })
        // this.satelliteLayer.on('seedprogress', event => {
        //     console.log("seedprogress", event)
        // })
        this.satelliteLayer.on('tilecachehit', event => {
            console.log(`HIT`)
        })
    }

    public clearCache() {
        this.satelliteLayer.clearCache()
    }

    private upload(markerId: number) {
        console.log(`upload() markerId: ${markerId}`)
        let formData = new FormData()
        formData.append("image", this.files.get(markerId))
        formData.append("marker_id", String(markerId))
        let xhr = new XMLHttpRequest()
        xhr.open("POST", `${"https:"}//${"floodfront.net"}:8080/upload`)
        xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
                let percent = event.loaded / event.total
                console.log(`${percent}% uploaded.`)
            } else {
                console.log(`Progress not computable.`)
            }
        })
        xhr.send(formData)
        xhr.addEventListener("loadend", () => {
            this.selectedMarker.closePopup()
        })
    }

    private toggleInfo() {
        this.info.toggle()
    }

    private toggleBaseMap() {
        if (this.isSatelliteLayer) {
            this.leafletMap.removeLayer(this.satelliteLayer)
            this.leafletMap.addLayer(this.simpleLayer)
        } else {
            this.leafletMap.removeLayer(this.simpleLayer)
            this.leafletMap.addLayer(this.satelliteLayer)
        }
        this.isSatelliteLayer = !this.isSatelliteLayer
    }

    /**
     * Centers map on user location using GPS Navigation.
     */
    private async centerMap() {
        console.log(`leaflet-map#centerMap called`)
        try {
            let pos: any = await this.nav.getCurrentPosition()
            console.log(pos)
            this.leafletMap.setView([pos.coords.latitude, pos.coords.longitude], 18)
        } catch (e) {
            console.warn(`Couldn't finish #centerMap`)
            console.warn(e)
        }
    }

    // private async query(event: KeyboardEvent) {
    //     // For now, navigate to first result.
    //     if (event.which === 13) {
    //         let result = await this.search.search(this.placeQuery)
    //         this.placeQuery = ""
    //         this.leafletMap.setView(result[0].latLng, 15)
    //     }
    // }

    private showSearch() {
        this.search.show()
    }

}

class DataMarker extends Marker {
    public clickCount: number
    public id: number
}