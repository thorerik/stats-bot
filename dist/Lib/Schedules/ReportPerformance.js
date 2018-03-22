"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schedule = require("node-schedule");
const Application_1 = require("../Application");
class ReportPerformance {
    static async run() {
        return schedule.scheduleJob("*/1 * * * *", async () => {
            const app = Application_1.Application.getInstance();
            app.writePerformanceData();
        });
    }
}
exports.ReportPerformance = ReportPerformance;
