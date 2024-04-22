const { EmbedBuilder } = require("discord.js");
const JUGNU = require("./Client");
const AutoresumeHandler = require("./AutoresumeHandler");
const InitAutoResume = require("./InitAutoResume");

/**
 *
 * @param {JUGNU} client
 */

const welcome = async (client, member) => {
  try {
    const channelId = "1162425003099295797"; // Thay YOUR_CHANNEL_ID bằng ID của kênh muốn gửi tin nhắn welcome

    const channel = member.guild.channels.cache.get(channelId);

    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setDescription(
        `Chào mừng ${member} đã đến với 𝑳𝑨̀𝑵𝑮 𝑺𝑼𝒀𝒀𝒀 ️🎉
         Nơi đây toàn trai xinh gái đẹp đang chờ bạn vào chung thôi đó 
         ▫️ Giao lưu chat chít với mọi người ở ⁠<#1160596724235120796>
         ▫️ Bạn cũng có thể post ảnh tại ⁠<#1161886312194908231>
         ▫️ Gửi tâm tư tình cảm mời bạn tới ⁠<#1171470017586540594>
         ▫️ Liveshow mỗi cuối tuần ở ⁠<#1167058859932794900>
         ▫️ Tạo room riêng chỉ cần ⁠<#1173644143210270811> là ok
         ▫️ Cuối cùng là nhớ pick role ở <#1176075883862298705>`,
      )
      .setImage(
        "https://gifdb.com/images/high/hello-cute-chick-kfte1eke27ff5385.gif",
      );

    channel.send({ embeds: [embed] });
  } catch (error) {
    console.error("An error occurred in welcome event:", error);
  }
};

module.exports = (client) => {
  // Tạo một đối tượng ánh xạ từ từ khóa đến phản hồi
  const responses = {
    "<@708854876691496980>":
      "Kêu cục cứt, muốn giề <:emoji1:1165898220120047646>",
    "<@978928369091616808>":
      "<@978928369091616808> bố ơi, có đứa kêu nè <:pepewow:1175341613602590811>",
    role: "Pick roles ở đây nè <#1176075883862298705>",
    tôm: "tomancut",
    tom: "tomancut",
    bin: "binancut",
    hdh: "hieuduahau ancutcho",
    thỏ: "bincontho ancut",
    vịt: "<@&1177158044010950677> zịt đi cả làng ơi",
    "<@569304165831016458>": "<:vany:1186150139539239003> mày ancut",
    xuka: "<:xuka:1177898838607007804> ashura ancutmeo`",
  };

  // Xử lý tin nhắn
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // Lấy nội dung tin nhắn và chuyển đổi thành chữ thường
    const content = message.content.toLowerCase();

    // Kiểm tra xem nội dung của tin nhắn có trong đối tượng responses không
    if (content in responses) {
      message.reply(responses[content]);
    }
  });

  // Sự kiện khi có thành viên mới vào server
  client.on("guildMemberAdd", async (member) => {
    welcome(client, member);
  });

  client.distube.on("playSong", async (queue, song) => {
    let data = await client.music.get(`${queue.textChannel.guildId}.music`);
    if (data) {
      await client.updatequeue(queue);
      await client.updateplayer(queue);
      if (data.channel === queue.textChannel.id) return;
    }

    queue.textChannel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setDescription(`** [\`${client.getTitle(song)}\`](${song.url}) **`)
            .addFields([
              {
                name: `Requested By`,
                value: `\`${song.user.tag}\``,
                inline: true,
              },
              {
                name: `Author`,
                value: `\`${song.uploader.name}\``,
                inline: true,
              },
              {
                name: `Duration`,
                value: `\`${song.formattedDuration}\``,
                inline: true,
              },
            ])
            .setFooter(client.getFooter(song.user)),
        ],
        components: [client.buttons(false)],
      })
      .then((msg) => {
        client.temp.set(queue.textChannel.guildId, msg.id);
      });
  });

  client.distube.on("addSong", async (queue, song) => {
    let data = await client.music.get(`${queue.textChannel.guildId}.music`);
    if (data) {
      await client.updatequeue(queue);
      if (data.channel === queue.textChannel.id) return;
    }
    queue.textChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setAuthor({
            name: `Added to Queue`,
            iconURL: song.user.displayAvatarURL({ dynamic: true }),
            url: song.url,
          })
          .setThumbnail(song.thumbnail)
          .setDescription(`[\`${client.getTitle(song)}\`](${song.url})`)
          .addFields([
            {
              name: `Requested By`,
              value: `\`${song.user.tag}\``,
              inline: true,
            },
            {
              name: `Author`,
              value: `\`${song.uploader.name}\``,
              inline: true,
            },
            {
              name: `Duration`,
              value: `\`${song.formattedDuration}\``,
              inline: true,
            },
          ])
          .setFooter(client.getFooter(song.user)),
      ],
    });
  });

  client.distube.on("addList", async (queue, playlist) => {
    let data = await client.music.get(`${queue.textChannel.guildId}.music`);
    if (data) {
      await client.updatequeue(queue);
      if (data.channel === queue.textChannel.id) return;
    }

    queue.textChannel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setAuthor({
              name: `Playlist Added to Queue`,
              iconURL: playlist.user.displayAvatarURL({ dynamic: true }),
              url: playlist.url,
            })
            .setThumbnail(playlist.thumbnail)
            .setDescription(`** [\`${playlist.name}\`](${playlist.url}) **`)
            .addFields([
              {
                name: `Requested By`,
                value: `\`${playlist.user.tag}\``,
                inline: true,
              },
              {
                name: `Songs`,
                value: `\`${playlist.songs.length}\``,
                inline: true,
              },
              {
                name: `Duration`,
                value: `\`${playlist.formattedDuration}\``,
                inline: true,
              },
            ])
            .setFooter(client.getFooter(playlist.user)),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });

  client.distube.on("disconnect", async (queue) => {
    try {
      const guildId = queue.textChannel.guildId;

      // Remove auto-resume entry
      await client.autoresume.delete(guildId);

      // Edit player message
      await client.editPlayerMessage(queue.textChannel);

      // Update embed
      await client.updateembed(client, queue.textChannel.guild);

      // Check if auto-joining is enabled in the database
      const db = await client.music?.get(`${guildId}.vc`);
      const data = await client.music.get(`${guildId}.music`);

      if (!db?.enable && data && data.channel !== queue.textChannel.id) {
        // If auto-joining is disabled and the current queue channel does not match the disconnected channel
        const embed = new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setDescription(
            `> The bot has been disconnected from the voice channel.`,
          );

        const msg = await queue.textChannel.send({ embeds: [embed] });
        setTimeout(() => msg.delete().catch(() => {}), 3000);
      } else if (db?.enable) {
        // If auto-joining is enabled, rejoin the voice channel
        await client.joinVoiceChannel(queue.textChannel.guild);
      }
    } catch (error) {
      console.error("An error occurred in disconnect event:", error);
    }
  });

  client.distube.on("error", async (channel, error) => {
    channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setTitle(`Found a Error...`)
            .setDescription(String(error).substring(0, 3000)),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });

  client.distube.on("noRelated", async (queue) => {
    queue.textChannel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setTitle(`No Related Song Found for \`${queue?.songs[0].name}\``),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });

  client.distube.on("finishSong", async (queue, song) => {
    await client.editPlayerMessage(queue.textChannel);
    await client.updatequeue(queue);
    await client.updateplayer(queue);
  });

  client.distube.on("finish", async (queue) => {
    await client.updateembed(client, queue.textChannel.guild);
    await client.editPlayerMessage(queue.textChannel);
    // Remove auto-resume entry
    await client.autoresume.delete(queue.textChannel.guild.id);

    queue.textChannel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setDescription(`Queue has ended! No more music to play`),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });

  client.distube.on("initQueue", async (queue) => {
    queue.volume = client.config.options.defaultVolume;

    // init auto resume for the queue
    await InitAutoResume(client, queue);
  });

  client.distube.on("searchCancel", async (message, quary) => {
    message.channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setDescription(`I cant search \`${quary}\``),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });

  client.distube.on("searchNoResult", async (message, quary) => {
    message.channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setDescription(
              `${client.config.emoji.ERROR} No result found for \`${quary}\`!`,
            ),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });
};
