"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log = require("fancy-log");
const EventBase_1 = require("../Lib/EventBase");
class Ready extends EventBase_1.EventBase {
    constructor() {
        super();
        this.subscribe = "ready";
    }
    run() {
        log(`${this.app.client.user.username} - (${this.app.client.user.id}) on ${this.app.client.guilds.size.toString()} guilds with ${this.app.client.channels.size.toString()} channels`);
        this.app.verifyDatabase();
        this.app.prepareInfluxDB();
    }
}
exports.Ready = Ready;
