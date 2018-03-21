import { readdir } from "fs";
import { join, resolve } from "path";

import { Client, Message } from "discord.js";

import * as log from "fancy-log";

import { Config } from "./Lib/Config";
import { Application } from "./Lib/Application";

const app = Application.getInstance();
app.config = new Config("./config.json");
app.client = new Client({
    disabledEvents: [
        "TYPING_START",
    ],
    sync: true,
});

// Register commands
app.registerCommands();

// Setup Database
app.setupDatabase();

// Register events
readdir(join(".", "./dist/Events/"), (error, files) => {
    if (error) {
        log.error(error);
        throw error;
    }

    files.forEach((file) => {
        const eventFile = require(`${resolve(".")}/dist/Events/${file}`);
        const eventName = file.split(".")[0];

        const eventClass = new eventFile[eventName]();

        log(`Registered event ${eventName} on ${eventClass.subscribe}`);

        app.client.on(
            eventClass.subscribe,
            (...args) => eventClass.run(...args),
        );
    });
});

app.client.login(app.config.config.token).catch((err) => {
    log.error(err);
    throw err;
});
