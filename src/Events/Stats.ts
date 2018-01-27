import { Message } from "discord.js";
import * as log from "fancy-log";

import { GuildConfiguration } from "../Database/Models/GuildConfiguration";
import { Messages } from "../Database/Models/Messages";
import { Stats as DbStats } from "../Database/Models/Stats";
import { EventBase } from "../Lib/EventBase";

export class Stats extends EventBase {
    private args: string[];

    constructor() {
        super();
    }
    public async run(message: Message) {

        if (message.guild === null || message.author.bot) {
            return;
        }

        const s = await DbStats.findOne({where: {guildID: message.guild.id, userId: message.author.id}});

        if (s === null) {
            await DbStats.create({
                count: 1,
                guildID: message.guild.id,
                userId: message.author.id,
            });
        } else {
            s.count++;
            s.save();
        }
        const guildConfiguration = await GuildConfiguration.findOne({where: {guildID: message.guild.id.toString()}});
        if (guildConfiguration === null) {
            throw new Error(`Settings is null for ${message.guild.id}`);
        }
        const guildConfig = JSON.parse(guildConfiguration.settings);
        if (guildConfig.recordMessages === "yes") {
            await Messages.create({
                guildID: message.guild.id,
                message: message.content,
                userId: message.author.id,
            });
        }
    }
}
