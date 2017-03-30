import { bindable, bindingMode, autoinject } from "aurelia-framework"
import { EventAggregator } from "aurelia-event-aggregator"

@autoinject()
export class InformationCustomElement {
    private name = "Information"
    @bindable({ defaultBindingMode: bindingMode.twoWay }) private myStyle = "visibility : visible;"
    private isVisible = true

    constructor(private ea: EventAggregator) {
        this.ea.subscribe("toggle-info", () => {
            this.toggle()
        })
    }

    public toggle() {
        console.log("information#toggle called", this.myStyle)
        this.isVisible = !this.isVisible
        if (this.isVisible) {
            // this.style.visibility = "visible"
            // $(".marker-menu-container").css("visibility", "visible")
            this.myStyle = "visibility : visible;"
        } else {
            // this.style.visibility = "hidden"
            // $(".marker-menu-container").css("visibility", "hidden")
            this.myStyle = "visibility : hidden;"
        }
    }
}