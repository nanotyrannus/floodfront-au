declare let window: any

import { child } from "aurelia-framework"
import { Router, RouterConfiguration } from "aurelia-router"
import { LoadingIndicatorCustomElement } from "./resources/elements/loading-indicator/loading-indicator"

export class App {
  private message = `Floodfront ${(new Date()).toISOString()}`
  private router: Router
  @child('loading-indicator') private indicator: LoadingIndicatorCustomElement

  created() {
    console.log("Main component created!")
    window.loading_screen.finish()
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router
    config.title = "Floodfront"
    config.map([
      { route: "", name: "home", moduleId: "login/login" },
      { route: "mode", name: "mode-menu", moduleId: "mode-menu/mode-menu" },
      { route: "map", name: "map", moduleId: "leaflet-map/leaflet-map" }
    ])
    config.mapUnknownRoutes("")
  }
}
