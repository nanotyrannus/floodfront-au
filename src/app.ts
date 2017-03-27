import { Router, RouterConfiguration } from "aurelia-router"

export class App {
  private message = `Floodfront ${(new Date()).toISOString()}`
  private router: Router

  configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router
    config.title = "Floodfront"
    config.map([
      { route: "", name: "home", moduleId: "login/login" },
      { route: "mode", name: "mode-menu", moduleId: "mode-menu/mode-menu"},
      { route: "map", name: "map", moduleId: "leaflet-map/leaflet-map"}
    ])
    config.mapUnknownRoutes("")
  }
}
