import { Message, Util, WebhookClient } from "discord.js";
import * as moment from "moment";
import { Application } from "./Application";

export class LogError {

    private app = Application.getInstance();

    /**
     * Log
     */
    public async Log(error: Error) {
        const webhookContent = {
            content: `:x: ** ERROR **`,
            embeds: [{
                color: Util.resolveColor([255, 0, 0]),
                fields: [
                    { name: "Exception", value: error.message, inline: false },
                    { name: "Stack", value: error.stack, inline: false},
                ],
                title: moment().format("ddd, Do of MMM @ HH:mm:ss"),
            }],
        };

        await this.app.getLogWebhookInstance().send(webhookContent);
    }
}
