"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log = require("fancy-log");
const Application_1 = require("../Lib/Application");
class Reload {
    constructor() {
        this.help = "Reloads all commands in the bot";
        this.examples = [
            "reload",
        ];
        this.permissionRequired = "BOT_OWNER";
        this.app = Application_1.Application.getInstance();
    }
    async run(message, args) {
        log("Reloading commands");
        this.app.registerCommands();
        message.react("👍");
    }
}
exports.Reload = Reload;
