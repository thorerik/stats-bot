import { readdir } from "fs";
import { hostname } from "os";
import { join, resolve } from "path";

import { Client, Collection, Message, WebhookClient } from "discord.js";
import { ISequelizeConfig, Sequelize } from "sequelize-typescript";

import * as log from "fancy-log";
import { InfluxDB, FieldType } from "influx";
import * as pidusage from "pidusage";

import { Command } from "./Command";
import { Config } from "./Config";

import { GuildConfiguration } from "../Database/Models/GuildConfiguration";

export class Application {

    public static getInstance(): Application {
        return Application.instance;
    }

    private static instance: Application = new Application();

    public client: Client;
    public db: Sequelize;
    public messages: number = 0;

    public config: Config;
    private logWH: WebhookClient;
    private commands: Collection<string, Command>;
    private influxDB: InfluxDB;
    private schedules: any[];

    constructor() {
        if (Application.instance) {
            throw new Error("Error: Instantiation failed: Use Application.getInstance() instead of new.");
        }
        Application.instance = this;
    }

    public getLogWebhookInstance(): WebhookClient {
        if (!this.logWH) {
            this.logWH = new WebhookClient(this.config.config.webhooks.logs.id, this.config.config.webhooks.logs.token);
        }
        return this.logWH;
    }

    public setCommand(name: string, command: Command) {
        this.commands.set(name, command);
    }

    public getCommand(name: string): Command {
        return this.commands.get(name);
    }

    public getCommands(): Collection<string, Command> {
        return this.commands;
    }

    public registerCommands() {
        this.commands = new Collection<string, Command>();
        readdir(join(".", "./dist/Commands/"), (error, files) => {
            if (error) {
                log.error(error);
                throw error;
            }

            files.forEach((file) => {
                delete require.cache[require.resolve(`${resolve(".")}/dist/Commands/${file}`)];
                const commandFile = require(`${resolve(".")}/dist/Commands/${file}`);
                const commandName = file.split(".")[0];

                const commandClass = new commandFile[commandName]();

                log(`Registered command ${commandName}`);

                this.setCommand(commandName.toLowerCase(), commandClass);
            });
        });
    }

    public async setupDatabase() {
        this.db = new Sequelize({
            database: this.config.config.database.database,
            dialect: this.config.config.database.dialect,
            host: this.config.config.database.host,
            logging: false,
            modelPaths: [join(resolve("."), "dist/Database/Models")],
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


    public async setupSchedules() {
        readdir(join(".", "./dist/Lib/Schedules/"), (error, files) => {
            if (error) {
                log.error(error);
                throw error;
            }
            if (this.schedules === undefined) {
                this.schedules = new Array();
            }

            files.forEach((file) => {
                delete require.cache[require.resolve(`${resolve(".")}/dist/Lib/Schedules/${file}`)];
                const scheduleFile = require(`${resolve(".")}/dist/Lib/Schedules/${file}`);
                const scheduleName = file.split(".")[0];

                if (this.schedules[scheduleName] !== undefined) {
                    try {
                        this.schedules[scheduleName].cancel();
                    } catch(e) {
                    } finally {
                        delete this.schedules[scheduleName];
                    }
                }

                this.schedules[scheduleName] = scheduleFile[scheduleName].run();

                log(`Registered Schedule ${scheduleName}`);

            });
        });
    }


    public async verifyDatabase() {
        this.client.guilds.forEach(async (guild) => {
            let guildConfiguration = await GuildConfiguration.findOne({where: {guildID: guild.id.toString()}});
            if (!guildConfiguration) {
                console.log(`Didn't find ${guild.name} in database, adding…`);
                guildConfiguration = new GuildConfiguration({
                    guildID: guild.id.toString(),
                    settings: JSON.stringify({
                        prefix: "st!",
                    }),
                });
                await guildConfiguration.save();
            }
        });
    }

    public async writeInfluxData(message: Message) {
        this.influxDB.writePoints([
            {
                measurement: 'messages',
                fields: { count: 1 },
                tags: { user: message.author.id, guild: message.guild.id, guildName: message.guild.name, bot: this.client.user.username },
            }
        ]);
    }

    public async writePerformanceData() {
        const stats = await pidusage(process.pid);
        this.influxDB.writePoints([
            {
                measurement: 'performance',
                fields: {
                    cpu: stats.cpu,
                    memory: stats.memory,
                    uptime: stats.elapsed
                },
                tags: {
                    bot: this.client.user.username,
                    host: hostname(),
                }
            }
        ]);
    }

    public async prepareInfluxDB() {
        this.influxDB = await new InfluxDB({
            host: this.config.config.influxDB.host,
            database: this.config.config.influxDB.database,
            schema: [
                {
                    measurement: 'messages',
                    fields: {
                        count: FieldType.INTEGER,
                    },
                    tags: [
                        'user',
                        'guild',
                        'guildName',
                        'bot'
                    ]
                },
                {
                    measurement: 'performance',
                    fields: {
                        cpu: FieldType.INTEGER,
                        memory: FieldType.INTEGER,
                        uptime: FieldType.INTEGER
                    },
                    tags: [
                        'bot',
                        'host'
                    ]
                },
            ],
        });

        let dbs = await this.influxDB.getDatabaseNames();
        if (!dbs.includes(this.config.config.influxDB.database)) {
            await this.influxDB.createDatabase(this.config.config.influxDB.database);
        }
    }

    private deleteCommand(name: string) {
        this.commands.delete(name);
    }
}
