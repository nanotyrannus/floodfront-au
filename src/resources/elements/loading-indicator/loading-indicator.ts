import { autoinject } from "aurelia-framework"
import { EventAggregator } from "aurelia-event-aggregator"

@autoinject()
export class LoadingIndicatorCustomElement {

    private opacity = 0
    private progress = 100

    constructor(private ea: EventAggregator) {
        console.log("LoadingIndicator constructed!")
        ea.subscribe("loading-indicator", (show: boolean) => {
            if (show) {
                this.opacity = 1
            } else {
                this.opacity = 0
            }
        })
        ea.subscribe("loading-indicator-progress", (value: number) => {
            console.log(`loading-indicator-progress ${value}`)
            if (this.opacity === 0) {
                this.opacity = 1
            }
            this.progress = value
        })
    }

    public setMax() {
        this.progress = 100
    }
}