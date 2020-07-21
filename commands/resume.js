const db = require("quick.db")
const l = require("../language.js")

exports.run = (client, message, args) => {
  const language = db.fetch(`user_${message.author.id}_language`)
  
  var d1 = null;
  var d2 = null;
  
  if (language == null) return db.set(`user_${message.author.id}_language`, "portugues")
  if (language == 'portugues'){
    d1 = l.NOT_HAVE_MUSIC_PT
    d2 = l.MUSIC_RESUME_PT
  } else if (language == 'english'){
    d1 = l.NOT_HAVE_MUSIC_EU
    d2 = l.MUSIC_RESUME_EU
  }
  
  const serverQueue = message.client.queue.get(message.guild.id);
  if (serverQueue && !serverQueue.playing) {
    serverQueue.playing = true;
    serverQueue.connection.dispatcher.resume();
    return message.channel.send(d2);
  }
  return message.channel.send(d1);
};
