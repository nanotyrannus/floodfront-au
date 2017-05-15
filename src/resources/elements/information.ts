import { bindable, bindingMode, autoinject } from "aurelia-framework"
import { CookieService } from "../../cookie/cookie-service"
import { EventAggregator } from "aurelia-event-aggregator"

@autoinject()
export class InformationCustomElement {
    private currentPage = 1
    private lastPage = 5 // Inclusive, page number of final page.
    private name = "Information"
    @bindable({ defaultBindingMode: bindingMode.twoWay }) private myStyle = "visibility : visible;"
    private isVisible = false
    private visibility = "hidden"
    private showOnCreate: string

    constructor(private ea: EventAggregator, private cookies: CookieService) {
        console.log("Information created")
        // this.showOnCreate = this.cookies.get("on-create-info")
        // if (!this.showOnCreate) {
        //     this.cookies.set("on-create-info", "show")
        //     this.toggle()
        // } else if (this.showOnCreate === "show") {
        //     this.toggle()
        // }
        this.ea.subscribe("keyboard-event", event => {
            if (event === "escape" && this.isVisible) {
                this.toggle()
            }
        })
    }

    public nextPage(): void {
        if (this.currentPage < this.lastPage) {
            this.currentPage++
        }
    }

    public prevPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--
        }
    }

    public toggle() {
        console.log("information#toggle called", this.myStyle)
        this.isVisible = !this.isVisible
        if (this.isVisible) {
            this.visibility = "visible"
        } else {
            this.currentPage = 1 // Set to first page in case re-opened
            this.visibility = "hidden"
        }
    }

    public toggleAndSave() {
        this.cookies.set("on-create-info", "hide")
        this.toggle()
    }
}

