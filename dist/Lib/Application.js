"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const discord_js_1 = require("discord.js");
const sequelize_typescript_1 = require("sequelize-typescript");
const log = require("fancy-log");
const GuildConfiguration_1 = require("../Database/Models/GuildConfiguration");
class Application {
    constructor() {
        this.messages = 0;
        if (Application.instance) {
            throw new Error("Error: Instantiation failed: Use Application.getInstance() instead of new.");
        }
        Application.instance = this;
    }
    static getInstance() {
        return Application.instance;
    }
    getLogWebhookInstance() {
        if (!this.logWH) {
            this.logWH = new discord_js_1.WebhookClient(this.config.config.webhooks.logs.id, this.config.config.webhooks.logs.token);
        }
        return this.logWH;
    }
    setCommand(name, command) {
        this.commands.set(name, command);
    }
    getCommand(name) {
        return this.commands.get(name);
    }
    getCommands() {
        return this.commands;
    }
    registerCommands() {
        this.commands = new discord_js_1.Collection();
        fs_1.readdir(path_1.join(".", "./dist/Commands/"), (error, files) => {
            if (error) {
                log.error(error);
                throw error;
            }
            files.forEach((file) => {
                delete require.cache[require.resolve(`${path_1.resolve(".")}/dist/Commands/${file}`)];
                const commandFile = require(`${path_1.resolve(".")}/dist/Commands/${file}`);
                const commandName = file.split(".")[0];
                const commandClass = new commandFile[commandName]();
                log(`Registered command ${commandName}`);
                this.setCommand(commandName.toLowerCase(), commandClass);
            });
        });
    }
    async setupSchedules() {
        fs_1.readdir(path_1.join(".", "./dist/Lib/Schedules/"), (error, files) => {
            if (error) {
                log.error(error);
                throw error;
            }
            if (this.schedules === undefined) {
                this.schedules = new Array();
            }
            files.forEach((file) => {
                delete require.cache[require.resolve(`${path_1.resolve(".")}/dist/Lib/Schedules/${file}`)];
                const scheduleFile = require(`${path_1.resolve(".")}/dist/Lib/Schedules/${file}`);
                const scheduleName = file.split(".")[0];
                if (this.schedules[scheduleName] !== undefined) {
                    this.schedules[scheduleName].cancel();
                }
                this.schedules[scheduleName] = scheduleFile[scheduleName].run();
                log(`Registered Schedule ${scheduleName}`);
            });
        });
    }
    async setupDatabase() {
        this.db = new sequelize_typescript_1.Sequelize({
            database: this.config.config.database.database,
            dialect: this.config.config.database.dialect,
            host: this.config.config.database.host,
            logging: false,
            modelPaths: [path_1.join(path_1.resolve("."), "dist/Database/Models")],
            operatorsAliases: false,
            password: this.config.config.database.password,
            pool: {
                acquire: 30000,
                idle: 10000,
                max: 10,
                min: 0,
            },
            port: this.config.config.database.port,
            username: this.config.config.database.username,
        });
        await this.db.sync();
    }
    async verifyDatabase() {
        this.client.guilds.forEach(async (guild) => {
            let guildConfiguration = await GuildConfiguration_1.GuildConfiguration.findOne({ where: { guildID: guild.id.toString() } });
            if (!guildConfiguration) {
                console.log(`Didn't find ${guild.name} in database, adding…`);
                guildConfiguration = new GuildConfiguration_1.GuildConfiguration({
                    guildID: guild.id.toString(),
                    settings: JSON.stringify({
                        prefix: "st!",
                    }),
                });
                await guildConfiguration.save();
            }
        });
    }
    deleteCommand(name) {
        this.commands.delete(name);
    }
}
Application.instance = new Application();
exports.Application = Application;
