import * as schedule from "node-schedule";

import { Application } from "../Application";

export class ReportPerformance {
    public static async run() {
        return schedule.scheduleJob("*/1 * * * * *", async () => {
            const app = Application.getInstance();
            app.writePerformanceData();
        });
    }
}
