import { CookieService } from "../cookie/cookie-service"
import { RestService } from "../rest/rest-service"
import { Router } from "aurelia-router"
import { inject, autoinject } from "aurelia-framework"

@autoinject()
export class UserService {

    private _email: string
    private _mode: string

    constructor(private cookies: CookieService, public router: Router, public rest: RestService) {
        if (!this.cookies.get("email")) {
            this.router.navigate("")
        } else {
            this._email = this.cookies.get("email")
        }
    }

    public async login(email: string) {
        let response = await this.rest.postWithRetry("login", { "email": email })
        let data = response.content
        this.router.navigate("mode")
        this.cookies.set("email", email)
        return data
    }

    public logout() {
        this.cookies.delete("email")
        this.router.navigate("")
    }

    get email(): string {
        return this._email
    }

    get mode(): string {
        return this._mode
    }

    set mode(val: string) {
        this._mode = val
    }
}