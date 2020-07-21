const express = require('express');
const db = require("quick.db")
const app = express();
app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});
app.listen(process.env.PORT);

require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const Enmap = require("enmap");
const ytdl = require("ytdl-core")

console.log(ytdl)

client.config = {
  token: process.env.DISCORD_TOKEN || "NzM0NDE1MDk0ODU4OTA3NjYw.XxRXfg.ZBP9aPLMTYHuHJd2ZKkQRGXJSd0",
  prefix: process.env.DISCORD_PREFIX || "n!",
  api: process.env.GOOGLE_API || "AIzaSyByqNY5qEo24UrFUMwZtVB79vzRmiVbS-g",
};
client.commands = new Enmap();
client.queue = new Map();

client.once("ready", () =>
  console.log("Ready, Logged in as " + client.user.tag)
);

fs.readdir(__dirname + "/commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
    console.log("Loading Command: "+commandName)
  });
});

client.on("message", (message) => {
  const author_language = db.fetch(`user_${message.author.id}_language`)
  if (author_language == null) return db.set(`user_${message.author.id}_language`, "portugues")
  if (!message.content.startsWith(client.config.prefix) || message.author.bot)
    return;
  const args = message.content.slice(client.config.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command) return;
  command.run(client, message, args);
});

client.login(client.config.token);
