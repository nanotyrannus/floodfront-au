import { autoinject } from "aurelia-framework"
import { EventAggregator } from "aurelia-event-aggregator"
import { SearchService } from "../../../search-service/search-service"

@autoinject
export class SearchCustomElement {
    private top: number
    private display: string
    private _isActive: boolean
    private locations: any[]
    private searchString: string
    private hasFocus: boolean

    constructor(private searchService: SearchService, private ea: EventAggregator) {
        this.top = 100
        this.display = "none"
        this._isActive = false
        this.hasFocus = false
        this.ea.subscribe("keyboard-event", event => {
            if (event === "find") {
                this.show()
            } else if (event === "escape" && this._isActive) {
                this.hide()
            }
        })
    }

    public async search(query: string) {
        this.locations = await this.searchService.search(query)
    }

    public select(latlng: any) {
        this.ea.publish("search-select", latlng)
        this.hide()
        console.log("SearchService#select", latlng)
    }

    private keypressListener(event: KeyboardEvent) {
        console.log(event)
        if (event.which === 13) {
            this.search(this.searchString)
        } else if (event.which === 27) { // esc
            this.hide()
        }
    }

    public show() {
        this.top = 0
        this.display = "block"
        this._isActive = true
        this.hasFocus = true
    }
    public hide() {
        this.top = 100
        this.display = "none"
        this._isActive = false
        this.hasFocus = false
    }

    get isActive(): boolean {
        return this._isActive
    }

}