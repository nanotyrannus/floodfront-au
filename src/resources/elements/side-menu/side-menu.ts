import { autoinject } from "aurelia-framework"
import { EventAggregator } from "aurelia-event-aggregator"

@autoinject
export class SideMenuCustomElement {
    
    private leftMargin: number

    constructor(public ea: EventAggregator) {
        this.leftMargin = -70
        this.ea.subscribe('keyboard-event', (event: string) => {
            if (event === "escape") {
                this.hide()
            }
        })

        this.ea.subscribe('swipe-event', (direction: string) => {
            if (direction === "left") {
                this.hide()
            } else if (direction === "right") {
                this.show()
            }
        })
    }

    public show() {
        this.leftMargin = 0
    }

    public hide() {
        this.leftMargin = -70
    }

    public showSearch() {
        this.hide()
        this.ea.publish('search-event')
    }

    public seedMap() {
        this.ea.publish('cache-event', "seed")
    }

    public clearCache() {
        this.ea.publish('cache-event', "clear")
    }
}
