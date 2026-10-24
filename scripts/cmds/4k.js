const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");

module.exports = {
  config: {
    name: "4k",
    version: "2.1.0",
    author: "Arafat",
    countDown: 5,
    role: 0,
    shortDescription: { en: "High Quality Image Enhancer" },
    category: "image"
  },

  onStart: async function ({ message, event, api }) {
    const { messageReply, messageID, threadID } = event;
    if (!messageReply?.attachments?.[0]?.url) return message.reply("❌ Please reply to an image.");

    const imageUrl = messageReply.attachments[0].url;
    const apiBase = "https://4k-v2.vercel.app"; 

    message.reaction("⚡", messageID);
    const loadingMsg = await api.sendMessage("⚡ Enhancing...", threadID);

    try {
      const response = await axios.get(`${apiBase}/api/enhance?url=${encodeURIComponent(imageUrl)}`);
      const resultUrl = response.data.imageUrl;

      if (!resultUrl) throw new Error("No URL");

      const img = await axios.get(resultUrl, { responseType: "arraybuffer" });
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
      
      const filePath = path.join(cacheDir, `hd_${Date.now()}.jpg`);
      await sharp(Buffer.from(img.data)).jpeg({ quality: 100 }).toFile(filePath);

      api.unsendMessage(loadingMsg.messageID);
      await message.reply({ attachment: fs.createReadStream(filePath) });
      
      message.reaction("✅", messageID);
      
      setTimeout(() => { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); }, 5000);
    } catch (err) {
      api.unsendMessage(loadingMsg.messageID);
      message.reply("❌ Error! Could not enhance the image.");
      message.reaction("💔", messageID);
    }
  }
};
