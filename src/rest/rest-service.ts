import { HttpClient } from "aurelia-http-client"

export class RestService {
    private _client = new HttpClient().configure(x => {
        x.withBaseUrl("https://floodfront.net:8080")
    })
    private baseUrl = `${"https"}//${"floodfront.net"}:${8080}`
    private inProgress = new Map()

    constructor() { }

    public async postWithRetry(endpoint: string, body: any) {
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
        return data
    }

    public async getWithRetry(endpoint: string) {
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
}