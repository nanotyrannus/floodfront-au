export class NavigationService {

    private watchId: number
    public currentPosition = {
        accuracy: -1,
        lat: -1,
        lon: -1
    }

    public initialize() {

        this.watchId = window.navigator.geolocation.watchPosition(pos => {
            this.currentPosition = {
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
                accuracy: pos.coords.accuracy
            }
        })

    }

    public getCurrentPosition() {
        let options = {
            "enableHighAccuracy": true
        }
        
        return new Promise(function (resolve, reject) {
            window.navigator.geolocation.getCurrentPosition(resolve, reject, options)
        })
    }
}