import { HttpClient } from "aurelia-http-client"

export class RestService {
    private _client = new HttpClient().configure(x => {
        x.withBaseUrl("https://floodfront.net:8080")
    })
    private baseUrl = `${"https"}//${"floodfront.net"}:${8080}`
    private inProgress = new Map()

    constructor() { }

    public async postWithRetry(endpoint: string, body: any) {
        let response = null
        let data = null
        // try {
        response = await this._client.post(`${endpoint}`, body)
        data = response.content
        // } catch (e) {
        //     console.warn("Failed to post!")
        // }

        // console.log("Server response", response)
        return data
    }

    public async getWithRetry(endpoint: string) {
        let response = null
        let data = null
        // try {
        response = await this._client.get(`${this.baseUrl}/${endpoint}`)
        data = response.content
        // } catch (e) {
        //     console.warn("Failed to get!")
        // }

        console.log("Server response", response)
        return data
    }
}