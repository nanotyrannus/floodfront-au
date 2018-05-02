import { autoinject } from "aurelia-framework"
import { HttpClient } from "aurelia-http-client"
import { EventAggregator } from "aurelia-event-aggregator"

@autoinject()
export class RestService {
    private _client: HttpClient
    private baseUrl = `https://${window.location.hostname}`
    private inProgress = new Map()
    private activeRequests = 0

    constructor(private ea: EventAggregator) {
        console.log(`RestService constructed!`)
        this._client = new HttpClient().configure(x => {
            x.withBaseUrl(this.baseUrl)
        })
    }

    public async postWithRetry(endpoint: string, body: any) {
        this.start()
        let data
        let attempts = 0
        while (data == null) {
            console.log(`postWithRetry attempt#${++attempts}`)
            try {
                data = await this.post(endpoint, body)
            } catch (e) {
                // console.warn(e)
                await this.wait(3000)
            }
        }
        this.finish()
        return data
    }

    public async getWithRetry(endpoint: string) {
        this.start()
        let data
        let attempts = 0
        while (data == null) {
            console.log(`getWithRetry attempt#${++attempts}`)
            try {
                data = await this.get(endpoint)
            } catch (e) {
                // console.warn(e)
                await this.wait(3000)
            }
        }
        this.finish()
        return data
    }

    public async post(endpoint: string, body: any) {
        let response = null
        let data = null
        response = await this._client.post(`${endpoint}`, body)
        data = response.content
        return data
    }

    public async get(endpoint: string) {
        let response = null
        let data = null

        response = await this._client.get(`${this.baseUrl}/${endpoint}`)
        data = response.content

        console.log("Server response", response)
        return data
    }

    private async wait(time: number) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, time | 0)
        })
    }

    private start() {
        this.activeRequests++
        this.ea.publish("loading-indicator", true)
    }

    private finish() {
        this.activeRequests--
        if (this.activeRequests === 0) {
            this.ea.publish("loading-indicator", false)
        }
    }
}