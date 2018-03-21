"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("../Lib/Application");
class EventBase {
    constructor() {
        this.subscribe = "message";
        this.app = Application_1.Application.getInstance();
    }
}
exports.EventBase = EventBase;
