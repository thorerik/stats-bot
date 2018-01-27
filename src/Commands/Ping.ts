import { Message, Permissions } from "discord.js";
import { Command } from "../Lib/Command";

export class Ping implements Command {
    public help = "Get a bot ping measurement";
    public examples = [
        "ping",
    ];
    public permissionRequired = Permissions.FLAGS.SEND_MESSAGES;
    public async run(message: Message, args: string[]) {
        const me = await message.channel.send("Ping?") as Message;
        me.edit(`Pong! Latency is ${
            me.createdTimestamp - message.createdTimestamp
        }ms. API Latency is ${
            Math.round(message.client.ping)
        }ms`);
    }
}
