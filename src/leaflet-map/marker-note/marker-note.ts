import { EventAggregator } from "aurelia-event-aggregator"
import { RestService } from "../../rest/rest-service"
import { autoinject } from "aurelia-framework"

@autoinject
export class MarkerNoteCustomElement {

    private id: number
    private message = "marker-note.ts"
    private description = null
    private visible = false

    constructor(private eventAggregator: EventAggregator, private rest: RestService) { }

    /**
     * NOTE: Using jquery workaround. Aurelia does not seem
     * to support dynamic CSS binding. Update later if false.
     * @param id ID of marker.
     */
    public open(id: number, desc?: string) {
        this.id = id
        // Workaround using global window. id becomes "null" for some reason.
        window["markerNote"] = { id: id }
        console.log(`markerNote#open: ${this.id}`)
        this.description = desc
        this.visible = !this.visible
        $(".marker-note-container").css("display", "block")
    }
    public close() {
        console.log(`markerNote#close`)
        this.visible = !this.visible
        $(".marker-note-container").css("display", "none")
    }

    public async submit() {
        // console.log(`marker-note: ${this.description}, ${this.id}`)
        await this.rest.postWithRetry(`marker/${window["markerNote"].id}/description`, {
            "description" : this.description
        })
        this.eventAggregator.publish("marker-note", {
            "description": this.description,
            "id": window["markerNote"].id
        })
        this.close()
    }
}