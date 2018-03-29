webpackJsonp([0],{

/***/ 110:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 110;

/***/ }),

/***/ 151:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 151;

/***/ }),

/***/ 196:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_speech_recognition__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_bluetooth_serial__ = __webpack_require__(195);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var HomePage = (function () {
    function HomePage(navCtrl, speechReg, change, btDevice, alertCtl, toastCtrl) {
        this.navCtrl = navCtrl;
        this.speechReg = speechReg;
        this.change = change;
        this.btDevice = btDevice;
        this.alertCtl = alertCtl;
        this.toastCtrl = toastCtrl;
        this.status = "Not connected";
        this.tabStatus = "Tab to Speak";
        this.isAvailable = false;
        this.isConnected = false;
        this.isRecording = false;
        this.deviceAvailable = false;
        this.scanStatus = "Scan";
        this.scanStarted = false;
        this.devices = [{
                name: 'Microsoft',
                id: '10.10.20.33',
                address: '10.10.20.33'
            }, {
                name: 'Android',
                id: '11.11.90.33',
                address: '11.11.90.33'
            }, {
                name: 'IOS',
                id: '100.20.12.54',
                address: '100.20.12.54'
            }];
        console.log(this.devices);
    }
    HomePage.prototype.action = function () {
        var _this = this;
        if (this.isRecording == false) {
            this.isVoiceAvailable();
            //Let check for Permission
            this.speechReg.hasPermission().then(function (hasPermission) {
                console.log(hasPermission);
                if (!hasPermission) {
                    _this.requestPermissionFromUser();
                }
            });
            this.isRecording = true;
            this.tabStatus = " Speak now";
            this.startRecording();
        }
        else if (this.isRecording == true) {
            this.isRecording = false;
            this.tabStatus = "Tab to Speak to again";
            this.speechReg.stopListening();
        }
    };
    HomePage.prototype.scanBT = function () {
        var _this = this;
        //Check of BT is turn on
        if (this.scanStarted == false) {
            this.btDevice.isEnabled().then(function (enab) {
                if (!enab) {
                    _this.btDevice.enable();
                }
            });
            //this.btDevice.setDiscoverable(1);
            //Set unpaired discoverable devices
            this.btDevice.discoverUnpaired().then(function (sucess) {
                _this.devices = sucess;
                _this.deviceAvailable = true;
            }, function (err) {
                console.log("Error occur in", err);
                _this.deviceAvailable = false;
            });
            this.scanStarted = true;
            this.scanStatus = "Disconnect";
        }
        else if (this.scanStarted == true) {
            this.showDisconnectedToast();
            this.btDevice.disconnect();
        }
    };
    //Methods to hold whether bluetooth is enabled
    HomePage.prototype.startRecording = function () {
        //document.getElementById(name).style.backgroundColor = "#f53d3d";
        var _this = this;
        var options = {
            language: "en-US"
        };
        this.speechReg.startListening(options)
            .subscribe(function (matches) {
            _this.matches = matches;
            console.log(matches[0]);
            _this.change.detectChanges();
            _this.btDevice.write(_this.matches[0]);
            //console.log(matches);
            (function (onerror) { return console.log('error: Something occurred', onerror); });
        });
    };
    HomePage.prototype.requestPermissionFromUser = function () {
        this.speechReg.requestPermission()
            .then(function () { return console.log("Granted"); }, function () { return console.log("Not Granted"); });
    };
    HomePage.prototype.isVoiceAvailable = function () {
        var _this = this;
        this.speechReg.isRecognitionAvailable()
            .then(function (available) {
            _this.isAvailable = available;
            console.log(_this.isAvailable);
        });
    };
    HomePage.prototype.stopRecording = function () {
        var _this = this;
        this.tabStatus = "Tab to Speak";
        this.speechReg.stopListening().then(function () {
            _this.isRecording = false;
        });
    };
    HomePage.prototype.selectDevice = function (something) {
        var _this = this;
        console.log(something);
        //Let show devices in alert box and select
        var alert = this.alertCtl.create({
            title: "Connect Device",
            message: "Do you want to connect " + something.name + " ?",
            buttons: [
                {
                    text: "Cancel",
                    role: "Cancel",
                    handler: function () {
                        console.log("Device disconnected");
                    }
                }, {
                    text: "Connect",
                    handler: function () {
                        //Let connect devices here
                        //Initialise device for connection
                        _this.btDevice.connect(something.address).subscribe(function (success) {
                            //Let pass a toast success to user as device is connect
                            _this.showToast();
                            _this.status = "Connected";
                        }, function (fail) {
                            console.log(fail);
                        });
                        _this.showToast();
                        console.log("Device connected");
                    }
                }
            ]
        });
        alert.present();
    };
    HomePage.prototype.showToast = function () {
        var toast = this.toastCtrl.create({
            message: 'Connected successfully',
            duration: 2000
        });
        this.status = "Connected";
        this.isConnected = true;
        toast.present();
    };
    HomePage.prototype.showDisconnectedToast = function () {
        var toast = this.toastCtrl.create({
            message: 'Disconnected Successfully',
            duration: 2000
        });
        this.scanStatus = "Scan";
        this.status = "Not Connected";
        this.isConnected = false;
        this.scanStarted = false;
        toast.present();
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"/var/www/IonicPro/ArduinoVoiceProject/src/pages/home/home.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      Voice Control Robot\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <button ion-button (click)="scanBT()" [color]="scanStarted ? \'danger\' : \'primary\'">{{scanStatus}} &nbsp;<ion-icon name="bluetooth"></ion-icon></button>\n  <button ion-button [color]="isConnected ? \'secondary\' : \'danger\'" clear>{{status}}</button>\n \n\n  <p text-center>{{tabStatus}}</p>\n  \n\n      <ion-row>\n        <ion-col col-4>\n        </ion-col>\n        <ion-col col-4 justify-content-center>\n            <div class="row">\n              <div class="col" padding>\n                  <button class="toggleMe" id="change" ion-button round (click)="action()" [color]="isRecording ? \'danger\' : \'primary\'" large><ion-icon name="mic"></ion-icon></button>\n              </div>\n            </div>\n        </ion-col>\n        <ion-col col-4>\n        </ion-col>\n      </ion-row>\n\n        <ion-card-header>Voice Command</ion-card-header>\n          <ion-list>\n            <ion-item *ngFor="let match of matches">\n              {{ match }}\n            </ion-item>\n          </ion-list>\n\n      <ion-list no-lines>\n        <ion-list-header>Available Devices</ion-list-header>\n          <div *ngIf="!deviceAvailable">\n              <button ion-item *ngFor="let device of devices" (click)="selectDevice(device)">\n                  {{ device.name }}\n              </button> \n          </div> \n      </ion-list>\n\n  \n  \n</ion-content>\n'/*ion-inline-end:"/var/www/IonicPro/ArduinoVoiceProject/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_speech_recognition__["a" /* SpeechRecognition */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["j" /* ChangeDetectorRef */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_bluetooth_serial__["a" /* BluetoothSerial */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* ToastController */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 197:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(221);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 221:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_speech_recognition__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_bluetooth_serial__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_component__ = __webpack_require__(272);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_home_home__ = __webpack_require__(196);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_8__pages_home_home__["a" /* HomePage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */], {}, {
                    links: []
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_8__pages_home_home__["a" /* HomePage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_speech_recognition__["a" /* SpeechRecognition */],
                __WEBPACK_IMPORTED_MODULE_6__ionic_native_bluetooth_serial__["a" /* BluetoothSerial */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 272:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(196);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/var/www/IonicPro/ArduinoVoiceProject/src/app/app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"/var/www/IonicPro/ArduinoVoiceProject/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ })

},[197]);
//# sourceMappingURL=main.js.map