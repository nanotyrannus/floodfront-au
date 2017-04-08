export class SearchCustomElement {
    private top: number
    private display: string

    constructor() {
        this.top = 100
        this.display = "none"
    }

    public show() {
        this.top = 0
        this.display = "block"
    }
    public hide() {
        this.top = 100
        this.display = "none"
    }
}