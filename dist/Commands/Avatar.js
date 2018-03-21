"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log = require("fancy-log");
const Application_1 = require("../Lib/Application");
class Avatar {
    constructor() {
        // tslint:disable-next-line:max-line-length
        this.help = "Sets avatar of the bot to <link>";
        this.examples = [
            "avatar <link>",
        ];
        this.permissionRequired = "BOT_OWNER";
    }
    async run(message, args) {
        const app = Application_1.Application.getInstance();
        try {
            await app.client.user.setAvatar(args.shift());
            await message.reply(`Avatar changed`);
        }
        catch (e) {
            await message.reply(`Failed to set avatar`);
            log.error(e);
            throw e;
        }
    }
}
exports.Avatar = Avatar;
