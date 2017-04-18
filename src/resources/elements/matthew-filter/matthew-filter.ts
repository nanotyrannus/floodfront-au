import { autoinject } from "aurelia-framework"

export class MatthewFilterCustomElement {

    public isActive: boolean
    private top: number
    private layerWrapper: LayerWrapper[]

    construtor() {
        this.top = 100
        this.isActive = false
    }

    public init(layers: L.TileLayer[], leafletRef: L.Map) {
        this.layerWrapper = [
            new LayerWrapper("Oct 7 2016", [layers[0]], leafletRef),
            new LayerWrapper("Oct 8 2016", [layers[1], layers[2]], leafletRef),
            new LayerWrapper("Oct 9 2016", [layers[3]], leafletRef),
            new LayerWrapper("Oct 10 2016", [layers[4]], leafletRef),
            new LayerWrapper("Oct 11 2016", [layers[5]], leafletRef),
            new LayerWrapper("Oct 13 2016", [layers[6]], leafletRef),
            new LayerWrapper("Oct 14 2016", [layers[7]], leafletRef),
            new LayerWrapper("Oct 15 2016", [layers[8]], leafletRef),
            new LayerWrapper("Oct 16 2016", [layers[9]], leafletRef)
        ]
        console.log(`MatthewFilter#init called!`)
    }

    public show() {
        this.top = 0
        this.isActive = true
    }
    public hide() {
        this.top = 100
        this.isActive = false
    }
}

class LayerWrapper {
    public isVisible: boolean
    public date: string
    public layers: L.TileLayer[]
    public leafletRef: L.Map

    public constructor(date: string, layers: L.TileLayer[], leafletRef: L.Map) {
        this.date = date
        this.layers = layers
        this.isVisible = false
        this.leafletRef = leafletRef
    }

    public toggle() {
        this.layers.forEach((layer: L.TileLayer) => {
            if (this.isVisible) {
                this.leafletRef.removeLayer(layer)
            } else {
                layer.addTo(this.leafletRef)
            }
        })
        this.isVisible = !this.isVisible
    }
}