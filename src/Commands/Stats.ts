import { Message, MessageEmbed, Permissions, Util, User } from "discord.js";

import * as log from "fancy-log";

import { GuildConfiguration } from "../Database/Models/GuildConfiguration";
import { Stats as DbStats } from "../Database/Models/Stats";
import { Command } from "../Lib/Command";

export class Stats implements Command {
    public help = "Gets you some stats for current guild";
    public examples = [
        "stats",
    ];
    public permissionRequired = Permissions.FLAGS.SEND_MESSAGES;

    public async run(message: Message, args: string[]) {
        const guildConfiguration = await GuildConfiguration.findOne({where: {guildID: message.guild.id.toString()}});
        const guildConfig = JSON.parse(guildConfiguration.settings);

        const stats = await DbStats.findAll({
            limit: 10,
            order: [
                ["count", "DESC"],
            ],
            where: {guildID: message.guild.id.toString()},
        });

        const embed = new MessageEmbed();

        embed.color = Util.resolveColor([0, 255, 255]);

        embed.thumbnail = {url: "https://i.imgur.com/ibsHxIR.png"};

        embed.title = "Top 10 spammers";

        embed.author = {
            iconURL: "https://i.imgur.com/ibsHxIR.png",
            name: "Statsbot",
        };

        embed.footer = {
            text: "Created by Tuxy Fluffyclaws#1337",
        };

        embed.description = "";

        stats.forEach((record) => {
            embed.description += `<@${record.userId}>: ${record.count}`;
            embed.description += "\n";
        });

        message.channel.send({embed});
    }
}
