import * as log from "fancy-log";

import { EventBase } from "../Lib/EventBase";
import { Application } from "../Lib/Application";

export class Ready extends EventBase {
    public subscribe = "ready";
    constructor() {
        super();
    }
    public run() {
        log(
            `${
                this.app.client.user.username
            } - (${
                this.app.client.user.id
            }) on ${
                this.app.client.guilds.size.toString()
            } guilds with ${
                this.app.client.channels.size.toString()
            } channels`,
        );
        
        this.app.verifyDatabase();
        this.app.prepareInfluxDB();
        this.app.setupSchedules();
    }
}
