const Discord = require("discord.js")
const db = require("quick.db")
const lg = require("../language.js")

exports.run = (client, message, args) => {
  switch (args[0]){   
    case "language":
      switch (args[1]){
        case "portugues":
          db.set(`user_${message.author.id}_language`, 'portugues')
          message.channel.send(lg.portugues)
        break;
          
        case "english":
          db.set(`user_${message.author.id}_language`, 'english')
          message.channel.send(lg.english)
        break;
      }
    break;
  }
}