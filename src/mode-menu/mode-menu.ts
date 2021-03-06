import { UserService } from "../user/user-service"
import { Router } from "aurelia-router"
import { autoinject } from "aurelia-framework"

@autoinject()
export class ModeMenu {    
    private email: string

    constructor(private userService: UserService, private router: Router) {
    }

    created() {
        this.email = this.userService.email
    }

    private enterMap(mode: string) {
        this.userService.mode = mode
        this.router.navigate("map")
    }

    private logout() {
        this.userService.logout()
    }
}