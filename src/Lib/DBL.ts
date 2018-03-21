import { request } from "https";
import { stringify } from "querystring";

import { Application } from "./Application";

export class DBL {
    public static postStats() {
        const app = Application.getInstance();
        if (!app.config.config.dblToken) {
            return;
        }
        const data = stringify({ server_count: app.client.guilds.size });
        const req = request({
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
