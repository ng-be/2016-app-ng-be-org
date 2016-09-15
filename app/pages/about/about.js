"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var PopoverPage = (function () {
    function PopoverPage(viewCtrl) {
        this.viewCtrl = viewCtrl;
    }
    PopoverPage.prototype.close = function () {
        this.viewCtrl.dismiss();
    };
    PopoverPage = __decorate([
        core_1.Component({
            template: "\n    <ion-list>\n      <button ion-item (click)=\"close()\">Learn Ionic</button>\n      <button ion-item (click)=\"close()\">Documentation</button>\n      <button ion-item (click)=\"close()\">Showcase</button>\n      <button ion-item (click)=\"close()\">GitHub Repo</button>\n    </ion-list>\n  "
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.ViewController])
    ], PopoverPage);
    return PopoverPage;
}());
var AboutPage = (function () {
    function AboutPage(popoverCtrl) {
        this.popoverCtrl = popoverCtrl;
        this.conferenceDate = '2047-05-17';
    }
    AboutPage.prototype.presentPopover = function (event) {
        var popover = this.popoverCtrl.create(PopoverPage);
        popover.present({ ev: event });
    };
    AboutPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/about/about.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.PopoverController])
    ], AboutPage);
    return AboutPage;
}());
exports.AboutPage = AboutPage;
