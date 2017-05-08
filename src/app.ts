declare let window: any

import { child, autoinject } from "aurelia-framework"
import { EventAggregator } from "aurelia-event-aggregator"
import { Router, RouterConfiguration } from "aurelia-router"
import { LoadingIndicatorCustomElement } from "./resources/elements/loading-indicator/loading-indicator"

@autoinject
export class App {
  private message = `Floodfront ${(new Date()).toISOString()}`
  private router: Router
  @child('loading-indicator') private indicator: LoadingIndicatorCustomElement

  constructor(private ea: EventAggregator) { }

  created() {
    console.log("Main component created!")
    window.loading_screen.finish()
    window.addEventListener("keydown", event => {
      console.log(event)
      if (event.ctrlKey && event.which === 70) {
        this.ea.publish("keyboard-event", "find")
        event.preventDefault()
      } else if (event.which === 27) {
        this.ea.publish("keyboard-event", "escape")
      }
    })
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
