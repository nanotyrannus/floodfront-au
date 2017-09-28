import { autoinject } from "aurelia-framework"
import { EventAggregator } from "aurelia-event-aggregator"

export class ModalDialogCustomElement {

    private message: string
    private isVisible: boolean

    constructor(private _ea: EventAggregator) {

    }

    private show() {
        this.isVisible = true
    }

    private hide() {
        this.isVisible = false
    }

    private onOk() {
        this._ea.publish('modal-event', {
            ok: true
        })
    }

    private onCancel() {
        this._ea.publish('modal-event', {
            ok: false,
            cancel: true
        })
    }
}