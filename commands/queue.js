const db = require("quick.db")
const l = require("../language.js")

exports.run = (client, message, args) => {
  const language = db.fetch(`user_${message.author.id}_language`)
  
  var d1 = null;
  var d2 = null;
  
  if (language == null) return db.set(`user_${message.author.id}_language`, "portugues")
  if (language == 'portugues'){
    d1 = l.NOT_HAVE_MUSIC_PT
    d2 = l.MUSIC_NOW_PT
  } else if (language == 'english'){
    d1 = l.NOT_HAVE_MUSIC_EU
    d2 = l.MUSIC_NOW_EU
  }
  
  const serverQueue = message.client.queue.get(message.guild.id);
  if (!serverQueue) return message.channel.send(d1);
  return message.channel.send(`
__**Song queue:**__

${serverQueue.songs.map((song) => `**-** ${song.title}`).join("\n")}

**${d2}:** ${serverQueue.songs[0].title}
		`);
};
