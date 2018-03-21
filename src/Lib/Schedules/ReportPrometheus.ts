import * as log from "fancy-log";
import * as schedule from "node-schedule";
import * as snekfetch from "snekfetch";

import { Application } from "../Application";

export class ReportPrometheus {
    public static async run() {
        return schedule.scheduleJob("*/1 * * * *", async () => {
            const app = Application.getInstance();
            const data = `bot_messages ${app.messages}
bot_guilds ${app.client.guilds.size}
bot_channels ${app.client.channels.size}
`;
            app.messages = 0;
            try {
                await snekfetch.put(`${app.config.config.pushGateway}/metrics/jobs/bots/instances/statsbot`, {
                    data,
                });
            } catch (e) {
                log.error(e);
            }
        });
    }
}
