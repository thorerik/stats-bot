import { Message } from "discord.js";

import * as log from "fancy-log";

import { Command } from "../Lib/Command";
import { Application } from "../Lib/Application";

export class Reload implements Command {
    public help = "Reloads all commands in the bot";
    public examples = [
        "reload",
    ];
    public permissionRequired = "BOT_OWNER";
    private app = Application.getInstance();

    public async run(message: Message, args: string[]) {
        log("Reloading commands");
        this.app.registerCommands();
        message.react("👍");
    }
}
