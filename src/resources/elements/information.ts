export class InformationCustomElement {
    private name = "Information"
    private style = { visibility: "visible" }
    private isVisible = true

    public toggle() {
        console.log("information#toggle called", this.style)
        this.isVisible = !this.isVisible
        if (this.isVisible) {
            this.style.visibility = "visible"
        } else {
            this.style.visibility = "hidden"
        }
    }
}