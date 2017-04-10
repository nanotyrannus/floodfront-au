export class SearchCustomElement {
    private top: number
    private display: string
    private _isActive: boolean

    constructor() {
        this.top = 100
        this.display = "none"
        this._isActive = false
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