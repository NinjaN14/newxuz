const { Util } = require("discord.js");
const ytdl = require("ytdl-core");
const YouTube = require("simple-youtube-api");
const db = require("quick.db")
const l = require("../language.js")

exports.run = async (client, message, args) => {  
    const language = await db.fetch(`user_${message.author.id}_language`)  
    
    var d1 = null;
    var d2 = null;
    var d3 = null;
    var d4 = null;
    var d5 = null;
    var d6 = null;
  
    if (language == null) return db.set(`user_${message.author.id}_language`, "portugues")   
    if (language == 'portugues'){
      d1 = l.NOT_CHANNEL_PT
      d2 = l.NOT_PERM_CHANNEL_PT
      d3 = l.NOT_MUSIC_USE_PT
      d4 = l.INIT_MUSIC_PT
      d5 = l.NOT_CHANNEL_ENTER_PT
      d6 = l.MUSIC_ADD_PT
    } else if (language == 'english'){
      d1 = l.NOT_CHANNEL_EU
      d2 = l.NOT_PERM_CHANNEL_EU
      d3 = l.NOT_MUSIC_USE_EU
      d4 = l.INIT_MUSIC_EU
      d5 = l.NOT_CHANNEL_ENTER_EU
      d6 = l.MUSIC_ADD_EU
    }
    
    const { channel } = message.member.voice;
    if (!channel)
      return message.channel.send(d1);
    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.channel.send(d2);
    if (!permissions.has("SPEAK"))
      return message.channel.send(d2);
    const youtube = new YouTube(client.config.api);
    var searchString = args.join(" ");
    if (!searchString)
      return message.channel.send(d3);
    const serverQueue = message.client.queue.get(message.guild.id);
    var videos = await youtube.searchVideos(searchString).catch(console.log);
    var songInfo = await videos[0].fetch().catch(console.log);

    const song = {
      id: songInfo.video_id,
      title: Util.escapeMarkdown(songInfo.title),
      url: songInfo.url,
    };

    if (serverQueue) {
      serverQueue.songs.push(song);
      console.log(serverQueue.songs);
      return message.channel.send(`> ✅ **${song.title}** `+ d6);
    }

    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: channel,
      connection: null,
      songs: [],
      volume: 2,
      playing: true,
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    const play = async (song) => {
      const queue = message.client.queue.get(message.guild.id);
      if (!song) {
        queue.voiceChannel.leave();
        message.client.queue.delete(message.guild.id);
        return;
      }

      const dispatcher = queue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
          queue.songs.shift();
          play(queue.songs[0]);
        })
        .on("error", (error) => console.error(error));
      dispatcher.setVolumeLogarithmic(queue.volume / 5);
      queue.textChannel.send(d4 + `: **${song.title}**`);
    };

    try {
      const connection = await channel.join();
      queueConstruct.connection = connection;
      play(queueConstruct.songs[0]);
    } catch (error) {
      console.error(`Não foi possivel entrar no canal: ${error}`);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel.send(d5 + `${error}`);
    }
};
