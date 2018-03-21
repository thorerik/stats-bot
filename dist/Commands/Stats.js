"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const GuildConfiguration_1 = require("../Database/Models/GuildConfiguration");
const Stats_1 = require("../Database/Models/Stats");
class Stats {
    constructor() {
        this.help = "Gets you some stats for current guild";
        this.examples = [
            "stats",
        ];
        this.permissionRequired = discord_js_1.Permissions.FLAGS.SEND_MESSAGES;
    }
    async run(message, args) {
        const guildConfiguration = await GuildConfiguration_1.GuildConfiguration.findOne({ where: { guildID: message.guild.id.toString() } });
        const guildConfig = JSON.parse(guildConfiguration.settings);
        const stats = await Stats_1.Stats.findAll({
            limit: 10,
            order: [
                ["count", "DESC"],
            ],
            where: { guildID: message.guild.id.toString() },
        });
        const embed = new discord_js_1.MessageEmbed();
        embed.color = discord_js_1.Util.resolveColor([0, 255, 255]);
        embed.thumbnail = { url: "https://i.imgur.com/ibsHxIR.png" };
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
        message.channel.send({ embed });
    }
}
exports.Stats = Stats;
