import * as Cookies from "js-cookie"

export class CookieService {

    get(key: string) {
        return Cookies.get(key)
    }

    set(key: string, value: string) {
        Cookies.set(key, value)
    }

    delete(key: string) {
        Cookies.remove(key)
    }
}