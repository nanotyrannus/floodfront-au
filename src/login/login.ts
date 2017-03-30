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
                logo: "https://placeholdit.imgix.net/~text?txtsize=5&txt=1%C3%971&w=1&h=1&txtpad=1",
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