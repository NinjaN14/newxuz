const db = require("quick.db")
const l = require("../language.js")

exports.run = (client, message, args) => {
    const language = db.fetch(`user_${message.author.id}_language`)
    
    var d1 = null;
    var d2 = null;
  
  if (language == null) return db.set(`user_${message.author.id}_language`, "portugues")  
  if (language == 'portugues'){
      d1 = l.NOT_HAVE_MUSIC_PT
      d2 = l.CHANNEL_EXIT_PT
    } else if (language == 'english'){
      d1 = l.NOT_HAVE_MUSIC_EU
      d2 = l.CHANNEL_EXIT_EU
    }
    
    const { channel } = message.member.voice;
    if (!channel)
      return message.channel.send(d1);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)
      return message.channel.send(d1);
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end(d2);
    message.channel.send(d2)
};
