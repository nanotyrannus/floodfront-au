import { autoinject } from "aurelia-framework"
import { SearchService } from "../../../search-service/search-service"

export class SearchCustomElement {
    private top: number
    private display: string
    private _isActive: boolean
    private locations: any[]

    constructor(private searchService: SearchService) {
        this.top = 100
        this.display = "none"
        this._isActive = false
    }

    public async search(query: string) {
        this.locations = await this.searchService.search(query)
    }

    public show() {
        this.top = 0
        this.display = "block"
        this._isActive = true
    }
    public hide() {
        this.top = 100
        this.display = "none"
        this._isActive = false
    }

    get isActive(): boolean {
        return this._isActive
    }

}