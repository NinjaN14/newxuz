const db = require("quick.db")
const l = require("../language.js")
const discord = require("discord.js")

exports.run = (client, message, args) => {
  const language = db.fetch(`user_${message.author.id}_language`)
  
  var d1 = null;
  var d2 = null;
  
 if (language == null) return db.set(`user_${message.author.id}_language`, "portugues")
 if (language == 'portugues'){
    d1 = l.HELP_MESSAGE_HEAD_PT
    d2 = l.HELP_MESSAGE_PT
  } else if (language == 'english'){
    d1 = l.HELP_MESSAGE_HEAD_EU
    d2 = l.HELP_MESSAGE_EU
  }
  
  message.channel.send(`${d2}`)
};
