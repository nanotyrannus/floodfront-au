import { Router } from "aurelia-router"
import { RestService } from "../rest/rest-service"
import { UserService } from "../user/user-service"
import { autoinject } from "aurelia-framework"
import { MarkerModel, MarkerType } from "./MarkerModel"
import { Marker } from "leaflet"
import { MarkerNoteCustomElement } from "./marker-note/marker-note"
import { EventAggregator } from "aurelia-event-aggregator"

@autoinject
export class LeafletMap {
    private leafletMap: L.Map
    private primed: boolean = false
    private selectedMarker: Marker
    private markerType: MarkerType
    private markers: Marker[]
    private markersModels: MarkerModel[]
    private files: Map<any, File> = new Map<any, File>()
    private nav: any = { currentPosition: {} }

    constructor(
        private router: Router,
        private rest: RestService, 
        private userService: UserService, 
        private markerNote: MarkerNoteCustomElement,
        private eventAggregator: EventAggregator) {

        this.eventAggregator.subscribe("marker-note", data => {
            console.log(data)
            this.markersModels.forEach(markerModel => {
                if (markerModel.id === data.id) {

                }
            })
        })

        this.getMarkers()
    }

    attached() {

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

        this.leafletMap = L.map("map", {
            "zoom": 18,
            "center": [0, 0],
            "doubleClickZoom": false
        })

        var matthewTiles = ["https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161007aOblique/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161008aOblique/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161008bOblique/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161009aOblique/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161010aOblique/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161011_RGB/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161013_RGB/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161014_RGB/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161015_RGB/{z}/{x}/{y}.png"
            , "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161016_RGB/{z}/{x}/{y}.png"]
        let matthewOptions = { tileSize: 256, minZoom: 1, maxZoom: 19, type: 'xyz' }

        let matthewLayer = L.layerGroup(
            matthewTiles.map(tileString => {
                return L.tileLayer(tileString, matthewOptions)
            })
        ).eachLayer(layer => {
            (layer as any).bringToFront()
        })

        if (this.userService.mode === "desktop") {
            matthewLayer.addTo(this.leafletMap)
            // L.control.layers(null, { "Matthew": matthewLayer }).addTo(this.leafletMap)
            L.tileLayer('https://api.mapbox.com/styles/v1/nanotyrannus/cj0kywrdm001n2smyhddxb7wb/tiles/256/{z}/{x}/{y}@2x?access_token={accessToken}', {
                // attribution: 'Map data &copy; OpenStreetMap contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 19,
                id: 'your.mapbox.project.id',
                accessToken: 'pk.eyJ1IjoibmFub3R5cmFubnVzIiwiYSI6ImNpcnJtMmNubDBpZTN0N25rZmMxaHg4ZHQifQ.vj7pif8Z4BVhbYs55s1tAw'
            }).addTo(this.leafletMap)
        } else {
            L.tileLayer('https://api.mapbox.com/styles/v1/nanotyrannus/ciye7ibx9000l2sk6v4n5bx3n/tiles/256/{z}/{x}/{y}@2x?access_token={accessToken}', {
                // attribution: 'Map data &copy; OpenStreetMap contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 19,
                id: 'your.mapbox.project.id',
                accessToken: 'pk.eyJ1IjoibmFub3R5cmFubnVzIiwiYSI6ImNpcnJtMmNubDBpZTN0N25rZmMxaHg4ZHQifQ.vj7pif8Z4BVhbYs55s1tAw'
            }).addTo(this.leafletMap)
        }

        // this.initiateNavigation

        this.leafletMap.on("dragstart", event => {
            // this.popup.hide()
            // this.popup.isVisible = false
            console.log("dragstart")
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

    goBack() {
        this.router.navigate("")
    }

    private async getMarkers() {
        // Must remove magic number '2'
        let data = await this.rest.postWithRetry("marker/2/retrieve", { "email": "ryan" })
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
        <!-- <button class="btn btn-default" onclick="window.leafletComponent.upload(${marker.id})">UPLOAD</button> -->
    `
        // if (marker.type === MarkerType.DIRECTIONAL) {
        //   markup += `<div>I'M DIRECTIONAL</div>`
        // }
        marker.bindPopup(markup, { "autoPan": false })
    }

    private async updateMarker(val0: any, val1: any) { }

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
        this.upload(markerId)
    }

    private upload(markerId: number) {
        let formData = new FormData()
        formData.append("image", this.files.get(markerId))
        formData.append("marker_id", markerId)
        let xhr = new XMLHttpRequest()
        xhr.open("POST", `${"https:"}//${"floodfront.net"}:8080/upload`)
        xhr.send(formData)
        xhr.addEventListener("loadend", () => {
            this.selectedMarker.closePopup()
        })
    }

    private toggleInfo() { }

    /**
     * Centers map on user location using GPS Navigation.
     */
    private centerMap() {
        // TODO r
        this.leafletMap.setView([0, 0], 18)
    }



}

class DataMarker extends Marker {
    public clickCount: number
    public id: number
}