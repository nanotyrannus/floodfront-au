define('app',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App() {
            this.message = "Floodfront " + (new Date()).toISOString();
        }
        App.prototype.created = function () {
            console.log("Main component created!");
            window.loading_screen.finish();
        };
        App.prototype.configureRouter = function (config, router) {
            this.router = router;
            config.title = "Floodfront";
            config.map([
                { route: "", name: "home", moduleId: "login/login" },
                { route: "mode", name: "mode-menu", moduleId: "mode-menu/mode-menu" },
                { route: "map", name: "map", moduleId: "leaflet-map/leaflet-map" }
            ]);
            config.mapUnknownRoutes("");
        };
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('cookie/cookie-service',["require", "exports", "js-cookie"], function (require, exports, Cookies) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CookieService = (function () {
        function CookieService() {
        }
        CookieService.prototype.get = function (key) {
            return Cookies.get(key);
        };
        CookieService.prototype.set = function (key, value) {
            Cookies.set(key, value);
        };
        CookieService.prototype.delete = function (key) {
            Cookies.remove(key);
        };
        return CookieService;
    }());
    exports.CookieService = CookieService;
});

define('leaflet-map/MarkerModel',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MarkerType;
    (function (MarkerType) {
        MarkerType[MarkerType["WALKABLE"] = 0] = "WALKABLE";
        MarkerType[MarkerType["FLOOD"] = 1] = "FLOOD";
        MarkerType[MarkerType["BORDER"] = 2] = "BORDER";
    })(MarkerType = exports.MarkerType || (exports.MarkerType = {}));
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('leaflet-map/leaflet-map',["require", "exports", "aurelia-router", "../rest/rest-service", "../user/user-service", "aurelia-framework", "./MarkerModel", "leaflet", "./marker-note/marker-note", "../navigation/navigation-service", "aurelia-event-aggregator", "../place-search/place-search", "../resources/elements/information", "aurelia-framework"], function (require, exports, aurelia_router_1, rest_service_1, user_service_1, aurelia_framework_1, MarkerModel_1, leaflet_1, marker_note_1, navigation_service_1, aurelia_event_aggregator_1, place_search_1, information_1, aurelia_framework_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LeafletMap = (function () {
        function LeafletMap(router, rest, userService, markerNote, eventAggregator, nav, search) {
            var _this = this;
            this.router = router;
            this.rest = rest;
            this.userService = userService;
            this.markerNote = markerNote;
            this.eventAggregator = eventAggregator;
            this.nav = nav;
            this.search = search;
            this.primed = false;
            this.files = new Map();
            this.searchText = "Search text";
            this.eventAggregator.subscribe("marker-note", function (data) {
                console.log(data);
                _this.markersModels.forEach(function (markerModel) {
                    if (markerModel.id === data.id) {
                    }
                });
            });
            this.getMarkers();
        }
        LeafletMap.prototype.attached = function () {
            var _this = this;
            if (!this.userService.email) {
                this.router.navigate("");
                return;
            }
            window['leafletComponent'] = {
                "upload": function (id) { return _this.upload(id); },
                "openNote": function () {
                    _this.markerNote.open(_this.selectedMarker.id);
                },
                "closeNote": function () {
                    _this.markerNote.close();
                },
                "readUrl": function (val, id) { return _this.readUrl(val, id); },
                "deleteMarker": function () {
                    _this.deleteMarker(_this.selectedMarker);
                }
            };
            this.leafletMap = L.map("map", {
                "zoom": 18,
                "center": [0, 0],
                "doubleClickZoom": false
            });
            var matthewTiles = ["https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161007aOblique/{z}/{x}/{y}.png",
                "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161008aOblique/{z}/{x}/{y}.png",
                "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161008bOblique/{z}/{x}/{y}.png",
                "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161009aOblique/{z}/{x}/{y}.png",
                "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161010aOblique/{z}/{x}/{y}.png",
                "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161011_RGB/{z}/{x}/{y}.png",
                "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161013_RGB/{z}/{x}/{y}.png",
                "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161014_RGB/{z}/{x}/{y}.png",
                "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161015_RGB/{z}/{x}/{y}.png",
                "https://geodesy.noaa.gov/storm_archive/storms/tilesb/services/tileserver.php/20161016_RGB/{z}/{x}/{y}.png"];
            var matthewOptions = { tileSize: 256, minZoom: 1, maxZoom: 19, type: 'xyz' };
            var matthewLayer = L.layerGroup(matthewTiles.map(function (tileString) {
                return L.tileLayer(tileString, matthewOptions);
            })).eachLayer(function (layer) {
                layer.bringToFront();
            });
            var simpleLayer = L.tileLayer('https://api.mapbox.com/styles/v1/nanotyrannus/cj0kywrdm001n2smyhddxb7wb/tiles/256/{z}/{x}/{y}@2x?access_token={accessToken}', {
                maxZoom: 19,
                id: 'your.mapbox.project.id',
                accessToken: 'pk.eyJ1IjoibmFub3R5cmFubnVzIiwiYSI6ImNpcnJtMmNubDBpZTN0N25rZmMxaHg4ZHQifQ.vj7pif8Z4BVhbYs55s1tAw'
            });
            var satelliteLayer = L.tileLayer('https://api.mapbox.com/styles/v1/nanotyrannus/ciye7ibx9000l2sk6v4n5bx3n/tiles/256/{z}/{x}/{y}@2x?access_token={accessToken}', {
                maxZoom: 19,
                id: 'your.mapbox.project.id',
                accessToken: 'pk.eyJ1IjoibmFub3R5cmFubnVzIiwiYSI6ImNpcnJtMmNubDBpZTN0N25rZmMxaHg4ZHQifQ.vj7pif8Z4BVhbYs55s1tAw'
            });
            var baseMaps = {
                "Simple": simpleLayer,
                "Satellite": satelliteLayer
            };
            var overlayMaps = {
                "Matthew": matthewLayer
            };
            if (this.userService.mode === "desktop") {
                simpleLayer.addTo(this.leafletMap);
                matthewLayer.addTo(this.leafletMap);
            }
            else {
                satelliteLayer.addTo(this.leafletMap);
            }
            L.control.layers(baseMaps, overlayMaps).addTo(this.leafletMap);
            this.leafletMap.on("dragstart", function (event) {
                console.log("dragstart");
            });
            this.leafletMap.on('click', function (event) {
                if (_this.primed) {
                    _this.primed = false;
                }
                else {
                    return;
                }
                _this.spawnMarker(event.latlng);
                console.log("placed marker at " + event.latlng.lat + ", " + event.latlng.lng);
            });
            this.centerMap();
        };
        LeafletMap.prototype.spawnMarker = function (latlng, type, oldMarker) {
            var _this = this;
            if (type === void 0) { type = null; }
            if (oldMarker === void 0) { oldMarker = null; }
            console.log("spawnMarker called with " + latlng);
            var marker = L.marker(latlng, { "draggable": true });
            var delay = 250;
            marker.clickCount = 0;
            marker.on('click', function (event) {
                console.log(marker.id);
                _this.selectedMarker = marker;
                marker.clickCount += 1;
                if (marker.clickCount === 2) {
                    console.log("Double click detected.");
                }
                setTimeout(function () {
                    if (marker.clickCount === 1) {
                        console.log("Single click detected");
                    }
                    marker.clickCount = 0;
                }, delay);
                setTimeout(function () {
                    $(":file").filestyle({
                        iconName: "glyphicon glyphicon-camera",
                        input: false,
                        buttonText: "Photo"
                    });
                    $("div.bootstrap-filestyle.input-group").css("width", "100%");
                    $("label.btn.btn-default").css("width", "100%");
                }, 0);
            });
            marker.on("contextmenu", function (event) {
                console.log("contextmenu event from " + marker.id, event);
                _this.selectedMarker = marker;
                event.originalEvent.preventDefault();
                _this.deleteMarker(marker);
            });
            if (oldMarker) {
                marker.id = oldMarker.id;
                console.log("Marker of id " + oldMarker.id + " retrieved of type " + oldMarker.marker_type);
            }
            else {
                marker.marker_type = MarkerModel_1.MarkerType[this.markerType];
                this.createMarker(latlng.lat, latlng.lng, marker, marker.marker_type);
            }
            var referenceMarker = (oldMarker) ? oldMarker : marker;
            if (referenceMarker.marker_type === MarkerModel_1.MarkerType[MarkerModel_1.MarkerType.WALKABLE]) {
                marker.setIcon(L.icon({
                    "iconUrl": "assets/images/marker_walkable.svg",
                    "iconSize": [25, 25]
                }));
            }
            else if (referenceMarker.marker_type === MarkerModel_1.MarkerType[MarkerModel_1.MarkerType.BORDER]) {
                marker.setIcon(L.icon({
                    "iconUrl": "assets/images/marker_border.svg",
                    "iconSize": [25, 25]
                }));
            }
            else if (referenceMarker.marker_type === MarkerModel_1.MarkerType[MarkerModel_1.MarkerType.FLOOD]) {
                marker.setIcon(L.icon({
                    "iconUrl": "assets/images/marker_flood.svg",
                    "iconSize": [25, 25]
                }));
            }
            else {
                console.warn("Marker type: " + referenceMarker.marker_type);
            }
            marker.on('dragend', function (e) {
                _this.updateMarker(marker.id, e.target._latlng);
            });
            this.bindPopup(marker);
            marker.addTo(this.leafletMap);
        };
        LeafletMap.prototype.goBack = function () {
            this.router.navigate("mode");
        };
        LeafletMap.prototype.getMarkers = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.rest.postWithRetry("marker/2/retrieve", { "email": this.userService.email })];
                        case 1:
                            data = _a.sent();
                            console.log("Markers!", data);
                            data.markers.forEach(function (marker) {
                                _this.spawnMarker([marker.lat, marker.lon], marker.marker_type, marker);
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        LeafletMap.prototype.primeMarker = function (type) {
            this.markerType = MarkerModel_1.MarkerType[type];
            this.primed = true;
        };
        LeafletMap.prototype.markerPlaced = function () {
            this.markerType = null;
            this.primed = false;
        };
        LeafletMap.prototype.createMarker = function (lat, lon, marker, type) {
            if (marker === void 0) { marker = null; }
            if (type === void 0) { type = null; }
            return __awaiter(this, void 0, void 0, function () {
                var payload, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            payload = {
                                "type": type,
                                "lat": lat,
                                "lon": lon,
                                "heading": (marker.heading != null) ? marker.heading : null,
                                "accuracy": this.nav.currentPosition.accuracy || -1,
                                "email": this.userService.email
                            };
                            console.log("createMarker payload", payload);
                            return [4 /*yield*/, this.rest.postWithRetry("marker/2", payload)];
                        case 1:
                            response = _a.sent();
                            console.log("leaflet-map#createMarker", response);
                            marker.id = response.id;
                            return [2 /*return*/];
                    }
                });
            });
        };
        LeafletMap.prototype.bindPopup = function (marker, type) {
            if (type === void 0) { type = MarkerModel_1.MarkerType.WALKABLE; }
            console.log("leafletMap#bindPopup: " + marker.id);
            marker.unbindPopup();
            var id = marker.id;
            var markup = "\n        <img id=\"thumbnail-" + marker.id + "\" class=\"thumbnail map-thumbnail\" src=\"/uploads/" + marker.id + ".jpg\">\n        <form enctype=\"multipart/form-data\" action=\"https://localhost:8080/upload\" method=\"POST\">\n        <input style=\"display: inline;\" class=\"filestyle\" data-iconName=\"glyphicon glyphicon-camera\" type=\"file\" name=\"picture\" accept=\"image/*\" onchange=\"window.leafletComponent.readUrl(this, " + marker.id + ")\">\n        </form>\n        <button class=\"btn btn-default context-btn\" onclick=\"window.leafletComponent.openNote()\">Note</button>\n        <button class=\"btn btn-default context-btn\" onclick=\"window.leafletComponent.deleteMarker()\">Delete</button>\n        <!-- <button class=\"btn btn-default\" onclick=\"window.leafletComponent.upload(" + marker.id + ")\">UPLOAD</button> -->\n    ";
            marker.bindPopup(markup, { "autoPan": false });
        };
        LeafletMap.prototype.updateMarker = function (id, latlng, heading) {
            if (heading === void 0) { heading = null; }
            console.log("updateMarker called with " + id + " " + heading, latlng);
            this.rest.postWithRetry("/marker/" + id + "/update", {
                "lat": latlng.lat,
                "lon": latlng.lng,
                "heading": heading
            });
        };
        LeafletMap.prototype.deleteMarker = function (marker) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    res = window.confirm("Delete marker?");
                    if (res) {
                        this.leafletMap.removeLayer(marker);
                        this.rest.postWithRetry("marker/" + marker.id + "/delete", {});
                    }
                    return [2 /*return*/];
                });
            });
        };
        LeafletMap.prototype.readUrl = function (value, markerId) {
            console.log(value);
            var elm = document.getElementById("thumbnail-" + markerId);
            var reader = new FileReader();
            reader.onload = function (e) {
                elm['src'] = e.target['result'];
            };
            reader.readAsDataURL(value.files[0]);
            this.files.set(markerId, value.files[0]);
            this.upload(markerId);
        };
        LeafletMap.prototype.upload = function (markerId) {
            var _this = this;
            var formData = new FormData();
            formData.append("image", this.files.get(markerId));
            formData.append("marker_id", markerId);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https:" + "//" + "floodfront.net" + ":8080/upload");
            xhr.send(formData);
            xhr.addEventListener("loadend", function () {
                _this.selectedMarker.closePopup();
            });
        };
        LeafletMap.prototype.toggleInfo = function () {
            this.info.toggle();
        };
        LeafletMap.prototype.centerMap = function () {
            return __awaiter(this, void 0, void 0, function () {
                var pos, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.nav.getCurrentPosition()];
                        case 1:
                            pos = _a.sent();
                            console.log(pos);
                            this.leafletMap.setView([pos.coords.latitude, pos.coords.longitude], 18);
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            console.log("centerMap something went wrong");
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        LeafletMap.prototype.query = function (event) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(event.which === 13)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.search.search(this.placeQuery)];
                        case 1:
                            result = _a.sent();
                            this.placeQuery = "";
                            this.leafletMap.setView(result[0].latLng, 15);
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        return LeafletMap;
    }());
    __decorate([
        aurelia_framework_2.child('information'),
        __metadata("design:type", information_1.InformationCustomElement)
    ], LeafletMap.prototype, "info", void 0);
    LeafletMap = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_router_1.Router,
            rest_service_1.RestService,
            user_service_1.UserService,
            marker_note_1.MarkerNoteCustomElement,
            aurelia_event_aggregator_1.EventAggregator,
            navigation_service_1.NavigationService,
            place_search_1.PlaceSearch])
    ], LeafletMap);
    exports.LeafletMap = LeafletMap;
    var DataMarker = (function (_super) {
        __extends(DataMarker, _super);
        function DataMarker() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return DataMarker;
    }(leaflet_1.Marker));
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('login/login',["require", "exports", "aurelia-router", "aurelia-framework", "../user/user-service"], function (require, exports, aurelia_router_1, aurelia_framework_1, user_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Login = (function () {
        function Login(router, userService) {
            this.router = router;
            this.userService = userService;
            this.email = "";
        }
        Login.prototype.login = function (event) {
            if (this.email === "") {
                console.warn("Empty email field.");
                return;
            }
            if (event.type === "click" || event.which === 13) {
                console.log("email entered: " + this.email);
                this.userService.login(this.email);
            }
            event.preventDefault();
        };
        Login.prototype.submit = function () {
        };
        return Login;
    }());
    Login = __decorate([
        aurelia_framework_1.inject(aurelia_router_1.Router, user_service_1.UserService),
        __metadata("design:paramtypes", [aurelia_router_1.Router, user_service_1.UserService])
    ], Login);
    exports.Login = Login;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('mode-menu/mode-menu',["require", "exports", "../user/user-service", "aurelia-router", "aurelia-framework"], function (require, exports, user_service_1, aurelia_router_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModeMenu = (function () {
        function ModeMenu(userService, router) {
            this.userService = userService;
            this.router = router;
        }
        ModeMenu.prototype.created = function () {
            this.email = this.userService.email;
        };
        ModeMenu.prototype.enterMap = function (mode) {
            this.userService.mode = mode;
            this.router.navigate("map");
        };
        ModeMenu.prototype.logout = function () {
            this.userService.logout();
        };
        return ModeMenu;
    }());
    ModeMenu = __decorate([
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [user_service_1.UserService, aurelia_router_1.Router])
    ], ModeMenu);
    exports.ModeMenu = ModeMenu;
});

define('navigation/navigation-service',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NavigationService = (function () {
        function NavigationService() {
            this.currentPosition = {
                accuracy: -1,
                lat: -1,
                lon: -1
            };
        }
        NavigationService.prototype.initialize = function () {
            var _this = this;
            this.watchId = window.navigator.geolocation.watchPosition(function (pos) {
                _this.currentPosition = {
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                    accuracy: pos.coords.accuracy
                };
            });
        };
        NavigationService.prototype.getCurrentPosition = function () {
            var options = {
                "enableHighAccuracy": true
            };
            return new Promise(function (resolve, reject) {
                window.navigator.geolocation.getCurrentPosition(resolve, reject, options);
            });
        };
        return NavigationService;
    }());
    exports.NavigationService = NavigationService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('place-search/place-search',["require", "exports", "aurelia-http-client", "aurelia-framework"], function (require, exports, aurelia_http_client_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlaceSearch = (function () {
        function PlaceSearch(http) {
            this.http = http;
            this.baseUrl = "https://www.mapquestapi.com/geocoding/v1/address?key=Z8jOSw6nAVGVOhHv6A4TYlQ1ldWVlNuX&maxResults=10";
        }
        PlaceSearch.prototype.search = function (place) {
            return __awaiter(this, void 0, void 0, function () {
                var result, response, locations;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.http.get(this.baseUrl + "&location=" + place)];
                        case 1:
                            result = _a.sent();
                            response = JSON.parse(result.response);
                            locations = response.results[0].locations;
                            return [2 /*return*/, locations];
                    }
                });
            });
        };
        return PlaceSearch;
    }());
    PlaceSearch = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_http_client_1.HttpClient])
    ], PlaceSearch);
    exports.PlaceSearch = PlaceSearch;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
});

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('rest/rest-service',["require", "exports", "aurelia-http-client"], function (require, exports, aurelia_http_client_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RestService = (function () {
        function RestService() {
            this._client = new aurelia_http_client_1.HttpClient().configure(function (x) {
                x.withBaseUrl("https://floodfront.net:8080");
            });
            this.baseUrl = "https" + "//" + "floodfront.net" + ":" + 8080;
            this.inProgress = new Map();
        }
        RestService.prototype.postWithRetry = function (endpoint, body) {
            return __awaiter(this, void 0, void 0, function () {
                var response, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            response = null;
                            data = null;
                            return [4 /*yield*/, this._client.post("" + endpoint, body)];
                        case 1:
                            response = _a.sent();
                            data = response.content;
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        RestService.prototype.getWithRetry = function (endpoint) {
            return __awaiter(this, void 0, void 0, function () {
                var response, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            response = null;
                            data = null;
                            return [4 /*yield*/, this._client.get(this.baseUrl + "/" + endpoint)];
                        case 1:
                            response = _a.sent();
                            data = response.content;
                            console.log("Server response", response);
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        return RestService;
    }());
    exports.RestService = RestService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('user/user-service',["require", "exports", "../cookie/cookie-service", "../rest/rest-service", "aurelia-router", "aurelia-framework"], function (require, exports, cookie_service_1, rest_service_1, aurelia_router_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserService = (function () {
        function UserService(cookies, router, rest) {
            this.cookies = cookies;
            this.router = router;
            this.rest = rest;
            console.log("UserService constructed!");
            if (this.cookies.get("email")) {
                this._email = this.cookies.get("email");
            }
        }
        UserService.prototype.login = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var response, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.rest.postWithRetry("login", { "email": email })];
                        case 1:
                            response = _a.sent();
                            data = response.content;
                            this.router.navigate("mode");
                            this._email = email;
                            this.cookies.set("email", email);
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        UserService.prototype.logout = function () {
            this.cookies.delete("email");
            this.router.navigate("");
        };
        Object.defineProperty(UserService.prototype, "email", {
            get: function () {
                return this._email;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserService.prototype, "mode", {
            get: function () {
                return this._mode;
            },
            set: function (val) {
                this._mode = val;
            },
            enumerable: true,
            configurable: true
        });
        return UserService;
    }());
    UserService = __decorate([
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [cookie_service_1.CookieService, aurelia_router_1.Router, rest_service_1.RestService])
    ], UserService);
    exports.UserService = UserService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('leaflet-map/marker-note/marker-note',["require", "exports", "aurelia-event-aggregator", "../../rest/rest-service", "aurelia-framework"], function (require, exports, aurelia_event_aggregator_1, rest_service_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MarkerNoteCustomElement = (function () {
        function MarkerNoteCustomElement(eventAggregator, rest) {
            this.eventAggregator = eventAggregator;
            this.rest = rest;
            this.message = "marker-note.ts";
            this.description = null;
            this.visible = false;
        }
        MarkerNoteCustomElement.prototype.open = function (id, desc) {
            this.id = id;
            window["markerNote"] = { id: id };
            console.log("markerNote#open: " + this.id);
            this.description = desc;
            this.visible = !this.visible;
            $(".marker-note-container").css("display", "block");
        };
        MarkerNoteCustomElement.prototype.close = function () {
            console.log("markerNote#close");
            this.visible = !this.visible;
            $(".marker-note-container").css("display", "none");
        };
        MarkerNoteCustomElement.prototype.submit = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.rest.postWithRetry("marker/" + window["markerNote"].id + "/description", {
                                "description": this.description
                            })];
                        case 1:
                            _a.sent();
                            this.eventAggregator.publish("marker-note", {
                                "description": this.description,
                                "id": window["markerNote"].id
                            });
                            this.close();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return MarkerNoteCustomElement;
    }());
    MarkerNoteCustomElement = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator, rest_service_1.RestService])
    ], MarkerNoteCustomElement);
    exports.MarkerNoteCustomElement = MarkerNoteCustomElement;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/elements/information',["require", "exports", "aurelia-framework", "aurelia-event-aggregator"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InformationCustomElement = (function () {
        function InformationCustomElement(ea) {
            var _this = this;
            this.ea = ea;
            this.name = "Information";
            this.myStyle = "visibility : visible;";
            this.isVisible = true;
            this.ea.subscribe("toggle-info", function () {
                _this.toggle();
            });
        }
        InformationCustomElement.prototype.toggle = function () {
            console.log("information#toggle called", this.myStyle);
            this.isVisible = !this.isVisible;
            if (this.isVisible) {
                this.myStyle = "visibility : visible;";
            }
            else {
                this.myStyle = "visibility : hidden;";
            }
        };
        return InformationCustomElement;
    }());
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], InformationCustomElement.prototype, "myStyle", void 0);
    InformationCustomElement = __decorate([
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator])
    ], InformationCustomElement);
    exports.InformationCustomElement = InformationCustomElement;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"styles.css\"></require><router-view></router-view></template>"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body, html {\n    width: 100%;\n    height: 100%;\n    box-sizing: border-box;\n    margin: 0;\n    padding: 0;\n    background-color: #2e589b;\n}\n\n@media (max-width: 400) {\n    span.login-title {\n        font-size: 3em;\n    }\n}\n\n@media (max-width: 800) {\n    span.login-title {\n        font-size: 5em;\n    }\n}\n\n#map {\n    width: 100%;\n    height: 100%;\n}\n\n/* Overriding leaflet class */\n.leaflet-control-zoom {\n    position: fixed !important;\n    bottom: 20%;\n    right: 3%;\n}\n\n.map-button {\n    height: 3em;\n    width: 3em;\n    background-color: #02a4d3;\n    color: #FFFFFF;\n    border: none;\n    background-color: #d3d3d3;\n}\n\n.context-btn {\n    margin-bottom: 1em !important;\n    width: 100%;\n}\n\n.map-button:active {\n    background-color: #FFFFFF;\n    color: #02a4d3;\n}\n\n.map-button-container {\n    z-index: 401;\n    position: absolute;\n    /*bottom: 20px;\n    right: 10px;*/\n}\n\n.map-thumbnail {\n    width: 200px;\n    height: 200px;\n}\n\n.marker-menu-button {\n    color: white;\n    background-color: #4c97ba;\n    display: table;\n    width: 100%;\n    height: 22%;\n    margin: 2%;\n}\n\n.marker-note-container {\n    z-index: 402;\n    width: 80%;\n    height: 50%;\n    position: fixed;\n    background-color: white;\n    right: 0;\n    left: 0;\n    top: 25%;\n    margin-right: auto;\n    margin-left: auto;\n    padding: 1%;\n}\n\n.marker-menu-text {\n    display: table-cell;\n    align-items: center;\n}\n\n.marker-menu-container {\n    position: fixed;\n    background-color: white;\n    right: 0;\n    left: 0;\n    top: 40%;\n    margin-right: auto;\n    margin-left: auto;\n    width: 75%;\n    height: 30%;\n    z-index:402;\n    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);\n    padding: 5%;\n}\n\n\n\n.login-container {}\n\n.vertical-center {\n  min-height: 100%;  /* Fallback for browsers do NOT support vh unit */\n  min-height: 100vh; /* These two lines are counted as one :-)       */\n\n  display: flex;\n  align-items: center;\n}\n\n.footer {\n    box-sizing: border-box;\n    color: rgb(100%, 100%, 100%);\n    width: 100%;\n    height: 10%;\n    background-color: rgb(20.2%, 20.2%, 20.2%);\n}\n\n.link:link {\n    text-decoration: none;\n}\n\n.link:hover {\n    text-decoration: none;\n}\n\n.slider-container {\n    position: fixed;\n    top: 100px;\n    left: 100px;\n    z-index: 400;\n}\n\n.jcs-value {\n    display: none;\n}"; });
define('text!leaflet-map/leaflet-map.html', ['module'], function(module) { module.exports = "<template><require from=\"leaflet/dist/leaflet.css\"></require><require from=\"./marker-note/marker-note\"></require><require from=\"./leaflet-map.css\"></require><require from=\"resources/elements/information\"></require><div class=\"map-context-menu\"></div><div class=\"map-button-container\" style=\"bottom:20px;right:10px\"><button class=\"map-button btn\" click.delegate=\"primeMarker('WALKABLE')\"><img src=\"/assets/images/marker_walkable.svg\"></button> <button class=\"map-button btn\" click.delegate=\"primeMarker('BORDER')\"><img src=\"/assets/images/marker_border.svg\"></button> <button class=\"map-button btn\" click.delegate=\"primeMarker('FLOOD')\"><img src=\"/assets/images/marker_flood.svg\"></button> <button class=\"map-button btn\" click.delegate=\"toggleInfo()\"><img src=\"/assets/images/info.svg\" style=\"width:100%\"></button></div><div class=\"map-button-container\" style=\"bottom:20px;left:10px\"><button class=\"map-button btn\" click.delegate=\"goBack()\"><span class=\"glyphicon glyphicon-chevron-left\"></span></button></div><div class=\"map-button-container\" style=\"bottom:12%;right:10px\"><button class=\"map-button btn\" click.delegate=\"centerMap()\"><img src=\"/assets/images/crosshair.svg\"></button></div><div id=\"map\"></div><popup [x]=\"clickX\" [y]=\"clickY\"></popup><marker-menu (onmarkerpicked)=\"onMarkerPicked($event)\"></marker-menu><marker-note></marker-note><div class=\"place-search-input-container\"><input type=\"text\" value.bind=\"placeQuery\" keyup.delegate=\"query($event)\" placeholder.bind=\"searchText\"></div><information></information></template>"; });
define('text!leaflet-map/leaflet-map.css', ['module'], function(module) { module.exports = ".place-search-input-container {\n    position: fixed;\n    top: 3%;\n    left: 3%;\n    padding: 1%;\n    z-index: 400;\n    background-color: white;\n    opacity: 0.3;\n}\n\n.place-search-input-container:hover {\n    opacity: 1.0;\n}"; });
define('text!login/login.html', ['module'], function(module) { module.exports = "<template><require from=\"login/login.css\"></require><div class=\"login-component-container vertical-center container\"><div class=\"container\"><div class=\"row\"><div class=\"col-md-12 col-xs-12 col-lg-12\"><div style=\"justify-content:center;display:flex;align-items:center;margin-top:10%\"><img src=\"assets/images/marker_walkable.svg\" class=\"logo\"> <img src=\"assets/images/marker_border.svg\" class=\"logo\"> <img src=\"assets/images/marker_flood.svg\" class=\"logo\"></div><div class=\"text-center\"><span class=\"login-title text-center\">Flood Front</span></div></div></div><div class=\"row\"><div class=\"col-md-12 col-sm-12 col-xs-12\"><div class=\"login-container\" style=\"width:100%\"><div class=\"input-group\" style=\"width:75%;margin:0 auto\"><span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-envelope\"></span> </span><input type=\"text\" keyup.delegate=\"login($event)\" class=\"form-control\" placeholder=\"Email\" value.bind=\"email\"> <span class=\"input-group-btn\"><button class=\"btn btn-default\" disabled.bind=\"email.length < 1\" click.delegate=\"login($event)\">ENTER</button></span></div></div></div></div></div></div></template>"; });
define('text!login/login.css', ['module'], function(module) { module.exports = "input[type=\"text\"] {\n    font-size: 2em;\n}\n\n.login-title {\n    color: white;\n    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);\n    font-size: 3em;\n}\n\n.login-component-container {\n    box-sizing: border-box;\n    width: 100%;\n    height: 100%;\n    /*background-image: url('/assets/images/albert st brisbane.jpg');*/\n    /*background-size: cover;*/\n}\n\n.logo {\n    width: 20%;\n    margin-left: 3%;\n    margin-right: 3%;\n    /*height: 250px;*/\n}"; });
define('text!mode-menu/mode-menu.html', ['module'], function(module) { module.exports = "<template><require from=\"./mode-menu.css\"></require><div><div class=\"mode-title\"><span>Logged in as ${ email }. Where are you?</span></div><div class=\"mode-button\" click.delegate=\"enterMap('field')\"><span>Out in the Field</span></div><div class=\"mode-button\" click.delegate=\"enterMap('desktop')\"><span>At a Desk</span></div><div class=\"mode-button\" click.delegate=\"logout()\"><span>Leaving (Log out)</span></div></div></template>"; });
define('text!mode-menu/mode-menu.css', ['module'], function(module) { module.exports = ".mode-title {\n    text-align: center;\n    color: white;\n    font-size: 3em;\n    margin: 5%;\n}\n\n.mode-button {\n    margin: 3%;\n    font-size: 5em;\n    text-align: center;\n    background-color: black;\n    color: white;\n}"; });
define('text!place-search/place-search.html', ['module'], function(module) { module.exports = "<template><require from=\"./place-search.css\"></require></template>"; });
define('text!place-search/place-search.css', ['module'], function(module) { module.exports = ""; });
define('text!leaflet-map/marker-note/marker-note.html', ['module'], function(module) { module.exports = "<template><require from=\"./marker-note.css\"></require><div class=\"marker-note-container\" class.bind=\"visible ? 'marker-visible' : 'marker-hidden'\"><textarea style=\"width:100%;height:80%\" value.bind=\"description\"></textarea><button class=\"btn btn-primary\" style=\"width:49%\" click.delegate=\"submit()\">Submit</button> <button class=\"btn btn-secondary\" style=\"width:49%\" click.delegate=\"close()\">Cancel</button></div></template>"; });
define('text!leaflet-map/marker-note/marker-note.css', ['module'], function(module) { module.exports = ".marker-hidden {\n    display: none;\n}\n\n.marker-visible {\n    display: block;\n}"; });
define('text!resources/elements/information.html', ['module'], function(module) { module.exports = "<template><require from=\"information.css\"></require><div class=\"marker-menu-container\" css.bind=\"myStyle\"><div><img class=\"marker-icon\" style=\"height:25%\" src=\"/assets/images/marker_walkable.svg\"> <span>Not Flooded</span></div><div><img class=\"marker-icon\" style=\"height:25%\" src=\"/assets/images/marker_border.svg\"> <span>Flood Boundary</span></div><div><img class=\"marker-icon\" style=\"height:25%\" src=\"/assets/images/marker_flood.svg\"> <span>Flooded</span></div><button class=\"btn btn-default\" click.delegate=\"toggle()\">CLOSE</button></div><div class=\"marker-menu-text\"></div></template>"; });
define('text!resources/elements/information.css', ['module'], function(module) { module.exports = ".marker-icon {\n    width: 30px;\n    height: 30px;\n}"; });
//# sourceMappingURL=app-bundle.js.map