import { Router } from "aurelia-router"
import { inject } from "aurelia-framework"
import { UserService } from "../user/user-service"

@inject(Router, UserService)
export class Login {

    private email: string 

    constructor(private router: Router, private userService: UserService) {
        this.email = ""
    }

    login(event: Event) {
        if (this.email === "") {
            console.warn("Empty email field.")
            return
        }
        if (event.type === "click" || (event as KeyboardEvent).which === 13) {
            console.log(`email entered: ${this.email}`)
            this.userService.login(this.email)
            // this.router.navigate("map")
        }
        event.preventDefault()
        // event.stopPropagation()
    }

    submit() {

    }
}