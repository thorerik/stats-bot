"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log = require("fancy-log");
const schedule = require("node-schedule");
const snekfetch = require("snekfetch");
const Application_1 = require("../Application");
class ReportPrometheus {
    static async run() {
        return schedule.scheduleJob("*/1 * * * *", async () => {
            const app = Application_1.Application.getInstance();
            const data = `bot_messages ${app.messages}
bot_guilds ${app.client.guilds.size}
bot_channels ${app.client.channels.size}
`;
            app.messages = 0;
            try {
                await snekfetch.put(`${app.config.config.pushGateway}/metrics/jobs/bots/instances/statsbot`, {
                    data,
                });
            }
            catch (e) {
                log.error(e);
            }
        });
    }
}
exports.ReportPrometheus = ReportPrometheus;
