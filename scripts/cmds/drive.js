const axios = require("axios");

function extractAllUrls(obj, result = []) {
  if (!obj) return result;
  if (typeof obj === "string") {
    const urls = obj.match(/(https?:\/\/[^\s]+)/g);
    if (urls) result.push(...urls);
  } else if (Array.isArray(obj)) {
    for (const item of obj) extractAllUrls(item, result);
  } else if (typeof obj === "object") {
    for (const key in obj) {
      extractAllUrls(obj[key], result);
    }
  }
  return result;
}

module.exports = {
  config: {
    name: "drive",
    aliases: [" "],
    version: "0.2",
    author: "Arafat",
    countDown: 5,
    role: 0,
    category: "UTILITY",
    guide: {
      en: "{pn} reply to a message that contains a media file (or a link to one)"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      if (!event.messageReply) {
        return message.reply("❌ | 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐚 𝐦𝐞𝐝𝐢𝐚 𝐟𝐢𝐥𝐞 𝐨𝐫 𝐔𝐑𝐋.");
      }

      const allUrls = extractAllUrls(event.messageReply);
      const uniqueUrls = [...new Set(allUrls)];

      if (uniqueUrls.length === 0) {
        return message.reply("❌ | 𝐍𝐨 𝐔𝐑𝐋 𝐟𝐨𝐮𝐧𝐝 𝐢𝐧 𝐭𝐡𝐞 𝐫𝐞𝐩𝐥𝐢𝐞𝐝 𝐦𝐞𝐬𝐬𝐚𝐠𝐞. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐚 𝐦𝐞𝐝𝐢𝐚 𝐟𝐢𝐥𝐞.");
      }

      const fileUrl = uniqueUrls[0];

      const waitMsg = await message.reply("⏳ | 𝐔𝐩𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐭𝐨 𝐝𝐫𝐢𝐯𝐞...");

      const res = await axios.post(
        "https://driver-public-by-arafat.vercel.app/api/upload",
        { url: fileUrl },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!res.data || !res.data.downloadUrl) {
        throw new Error("Upload failed");
      }

      await api.unsendMessage(waitMsg.messageID);

      return message.reply(
        `✅ 𝐃𝐫𝐢𝐯𝐞 𝐔𝐩𝐥𝐨𝐚𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥\n\n🔗 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐋𝐢𝐧𝐤:\n${res.data.downloadUrl}`
      );

    } catch (err) {
      return message.reply("❌ | 𝐄𝐫𝐫𝐨𝐫: " + err.message);
    }
  }
};
