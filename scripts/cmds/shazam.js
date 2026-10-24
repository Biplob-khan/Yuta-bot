const axios = require("axios");

module.exports = {
  config: {
    name: "shazam",
    aliases: ["finds"],
    version: "3.2.1",
    author: "Arafat",
    countDown: 5,
    role: 0,
    description: "Identify any song and extract metadata with OMNI-X core.",
    category: "info",
    guide: "{pn} [reply to audio/video]"
  },

  onStart: async function ({ api, event, message, commandName }) {
    const { threadID, messageID, messageReply } = event;

    if (!messageReply?.attachments?.length)
      return message.reply("⚠️ Please reply to an audio or video file.");

    const attachment = messageReply.attachments[0];

    // Compatible with arafat-fca
    const mediaUrl =
      attachment.url ||
      attachment.playable_url ||
      attachment.audio_url ||
      attachment.raw?.playable_url ||
      attachment.raw?.audio_playable_url ||
      attachment.raw?.playableUrl ||
      attachment.raw?.url;

    if (!mediaUrl)
      return message.reply("❌ No playable audio/video found.");

    try {
      const apiBase = String(global.GoatBot.config.Arafat?.api || "").trim();

      if (!apiBase)
        return message.reply("❌ API URL not configured.");

      const { data } = await axios.post(`${apiBase}/shazam/arafat`, {
        url: mediaUrl
      });

      if (!data?.status)
        return message.reply("❌ Metadata not found.");

      const info = data.result;

      api.setMessageReaction("✨", messageID, () => {}, true);
      api.setMessageReaction("🌊", messageID, () => {}, true);

      const msg =
        `ღ 𝖮𝖬𝖭𝖨-𝖷 𝖠𝖭𝖠𝖫𝖸𝖳𝖨𝖢𝖲\n` +
        `ღ 𝖲𝖸𝖲𝖳𝖤𝖬 𝖡𝖸 𝖠𝖱𝖠𝖥𝖠𝖳\n\n` +
        `❍ 𝖳𝗂𝗍𝗅𝖾: ${info.title || "Unknown"}\n` +
        `❍ 𝖠𝗋𝗍𝗂𝗌𝗍: ${info.artist || "Unknown"}\n` +
        `❍ 𝖠𝗅𝖻𝗎𝗆: ${info.album || "Unknown"}\n` +
        `❍ 𝖦𝖾𝗇𝗋𝖾: ${info.genre || "Unknown"}\n` +
        `❍ 𝖱𝖾𝗅𝖾𝖺𝗌𝖾: ${info.release || "Unknown"}\n\n` +
        `✰ Reply "send" to get audio`;

      return api.sendMessage(
        {
          body: msg,
          attachment: info.image
            ? await global.utils.getStreamFromURL(info.image)
            : null
        },
        threadID,
        (err, sendInfo) => {
          if (!err) {
            global.GoatBot.onReply.set(sendInfo.messageID, {
              commandName,
              messageID: sendInfo.messageID,
              author: event.senderID,
              ytUrl: info.youtube_url
            });
          }
        },
        messageID
      );

    } catch (e) {
      console.log(e);
      return message.reply("❗ System Link Failure.");
    }
  },

  onReply: async function ({ event, api, Reply, message }) {
    if (event.senderID !== Reply.author) return;

    if (event.body.toLowerCase().trim() !== "send") return;

    try {
      const apiBase = String(global.GoatBot.config.Arafat?.api || "").trim();

      if (!apiBase)
        return message.reply("❌ API URL not configured.");

      api.setMessageReaction("✨", event.messageID, () => {}, true);
      api.setMessageReaction("🌊", event.messageID, () => {}, true);

      const res = await axios({
        url: `${apiBase}/download/arafatadl?url=${encodeURIComponent(Reply.ytUrl)}`,
        method: "GET",
        responseType: "stream",
        timeout: 0
      });

      return api.sendMessage(
        {
          attachment: res.data
        },
        event.threadID,
        () => api.setMessageReaction("✅", event.messageID, () => {}, true),
        event.messageID
      );

    } catch (err) {
      console.log(err);
      return message.reply("❌ Core Download Error.");
    }
  }
};
