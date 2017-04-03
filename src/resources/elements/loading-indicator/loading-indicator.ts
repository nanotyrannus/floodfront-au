import { autoinject } from "aurelia-framework"
import { EventAggregator } from "aurelia-event-aggregator"

@autoinject()
export class LoadingIndicatorCustomElement {

    private opacity = 0

    constructor(private ea: EventAggregator) {
        console.log("LoadingIndicator constructed!")
        ea.subscribe("loading-indicator", (show: boolean) => {
            if (show) {
                this.opacity = 1
            } else {
                this.opacity = 0
            }
        })
    }
}