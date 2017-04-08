import { HttpClient } from "aurelia-http-client"
import { autoinject } from "aurelia-framework"

@autoinject
export class SearchService {

    
    
    // TODO change PlaceSearch to be server-sided. Must protect API key.
    private baseUrl = "https://www.mapquestapi.com/geocoding/v1/address?key=Z8jOSw6nAVGVOhHv6A4TYlQ1ldWVlNuX&maxResults=10"
    private cache: Map<string, any[]>

    constructor(private http: HttpClient) {
        this.cache = new Map<string, any[]>()
    }

    public async search(place: string) {
        let result = await this.http.get(`${this.baseUrl}&location=${place}`)
        let response = JSON.parse(result.response)
        let locations = response.results[0].locations
        this.cache.set(place, locations)
        console.log(locations)
        return locations
    }
}

