"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GuildConfiguration_1 = require("../Database/Models/GuildConfiguration");
const Messages_1 = require("../Database/Models/Messages");
const Stats_1 = require("../Database/Models/Stats");
const EventBase_1 = require("../Lib/EventBase");
class Stats extends EventBase_1.EventBase {
    constructor() {
        super();
    }
    async run(message) {
        if (message.guild === null || message.author.bot) {
            return;
        }
        const s = await Stats_1.Stats.findOne({ where: { guildID: message.guild.id, userId: message.author.id } });
        if (s === null) {
            await Stats_1.Stats.create({
                count: 1,
                guildID: message.guild.id,
                userId: message.author.id,
            });
        }
        else {
            s.count++;
            s.save();
        }
        const guildConfiguration = await GuildConfiguration_1.GuildConfiguration.findOne({ where: { guildID: message.guild.id.toString() } });
        if (guildConfiguration === null) {
            throw new Error(`Settings is null for ${message.guild.id}`);
        }
        const guildConfig = JSON.parse(guildConfiguration.settings);
        if (guildConfig.recordMessages === "yes") {
            await Messages_1.Messages.create({
                guildID: message.guild.id,
                message: message.content,
                userId: message.author.id,
            });
        }
    }
}
exports.Stats = Stats;
