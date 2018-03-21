"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
const querystring_1 = require("querystring");
const Application_1 = require("./Application");
class DBL {
    static postStats() {
        const app = Application_1.Application.getInstance();
        if (!app.config.config.dblToken) {
            return;
        }
        const data = querystring_1.stringify({ server_count: app.client.guilds.size });
        const req = https_1.request({
            headers: {
                "Authorization": app.config.config.dblToken,
                "Content-Length": Buffer.byteLength(data),
                "Content-Type": "application/x-www-form-urlencoded",
            },
            host: "discordbots.org",
            method: "POST",
            path: `/api/bots/${app.client.user.id}/stats`,
        });
        req.write(data);
        req.end();
    }
}
exports.DBL = DBL;
