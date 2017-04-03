import { Router } from "aurelia-router"
import { inject } from "aurelia-framework"
import { UserService } from "../user/user-service"
declare let window: any

@inject(Router, UserService)
export class Login {

    private email: string

    constructor(private router: Router, private userService: UserService) {
        this.email = ""
    }

    public async login(event: Event) {

        if (this.email === "") {
            console.warn("Empty email field.")
            return
        }
        if (event.type === "click" || (event as KeyboardEvent).which === 13) {
            console.log(`email entered: ${this.email}`)
            window.loading_screen = window.pleaseWait({
                logo: "assets/images/blank.svg",
                backgroundColor: '#2e589b',
                loadingHtml: "<div class='loading-message'>Logging in...</div>"
            });
            await this.userService.login(this.email)
            window.loading_screen.finish()
            // this.router.navigate("map")
        }
        event.preventDefault()
        // event.stopPropagation()
    }

    submit() {

    }
}