const db = require("quick.db")
const l = require("../language.js")

exports.run = async (client, message, args) => {
  const language = db.fetch(`user_${message.author.id}_language`)
  
  var d1 = null;
  var d2 = null;
  var d3 = null;
  
  if (language == null) return db.set(`user_${message.author.id}_language`, "portugues")
  if (language == 'portugues'){
    d1 = l.NOT_HAVE_MUSIC_PT
    d2 = l.CURRENT_VOLUME_PT
    d3 = l.VOLUME_SET_PT
  } else if (language == 'english'){
    d1 = l.NOT_HAVE_MUSIC_EU
    d2 = l.CURRENT_VOLUME_EU
    d3 = l.VOLUME_SET_EU
  }
  
  const { channel } = message.member.voice;
  if (!channel)
    return message.channel.send(d1);
  const serverQueue = message.client.queue.get(message.guild.id);
  if (!serverQueue) return message.channel.send(d1);
  if (!args[0])
    return message.channel.send(d2 +` **${serverQueue.volume}**`);
  serverQueue.volume = args[0]; 
  serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
  return message.channel.send(d3 +` **${args[0]}**`);
};
