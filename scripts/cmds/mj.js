const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");

module.exports = {
  config: {
    name: "mj",
    version: "1.3",
    author: "Arafat",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Midjourney Image Generator & Editor with Grid Selection"
    },
    category: "image"
  },

  onStart: async function ({ message, event, args, api }) {
    const { messageReply, messageID, threadID, senderID } = event;

    const apiBase = String(global.GoatBot.config.Arafat?.api || "").trim();
    if (!apiBase) {
      return message.reply("❌ ᴀᴘɪ ʙᴀsᴇ ɴᴏᴛ ғᴏᴜɴᴅ ɪɴ ᴄᴏɴғɪɢ");
    }

    const isEditMode = args[0]?.toLowerCase() === "-e";
    let prompt = "";
    let jsonUrl = "";

    if (isEditMode) {
      if (!messageReply || !messageReply.attachments || messageReply.attachments[0].type !== "photo") {
        return message.reply("⚠️ ᴘʟᴇᴀsᴇ ʀᴇᴘʟʏ ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ ᴡɪᴛʜ 'ᴍᴊ -ᴇ [ᴘʀᴏᴍᴘᴛ]' ᴛᴏ ᴇᴅɪᴛ.");
      }
      prompt = args.slice(1).join(" ");
      if (!prompt) {
        return message.reply("⚠️ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀɴ ᴇᴅɪᴛ ᴘʀᴏᴍᴘᴛ.");
      }
      const imageUrl = messageReply.attachments[0].url;
      jsonUrl = `${apiBase}/edit2/json/mj?url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(prompt)}`;
    } else {
      prompt = args.join(" ");
      if (!prompt) {
        return message.reply("⚠️ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴘʀᴏᴍᴘᴛ ғᴏʀ ᴍɪᴅᴊᴏᴜʀɴᴇʏ.");
      }
      jsonUrl = `${apiBase}/edit2/gen/json/mj?prompt=${encodeURIComponent(prompt)}`;
    }

    message.reaction("✨", messageID);
    const loading = await api.sendMessage(
      `✨ ɢᴇɴᴇʀᴀᴛɪɴɢ ɢʀɪᴅ...\n🤖 ᴍᴏᴅᴇ: ᴍɪᴅᴊᴏᴜʀɴᴇʏ ${isEditMode ? "ᴇᴅɪᴛ" : "ɢᴇɴᴇʀᴀᴛɪᴏɴ"}`,
      threadID
    );

    try {
      const apiRes = await axios.get(jsonUrl).catch(() => null);

      if (!apiRes || !apiRes.data || !apiRes.data.all) {
        if (loading?.messageID) api.unsendMessage(loading.messageID);
        message.reaction("❌", messageID);
        return message.reply("❌ sᴇʀᴠᴇʀ ʀᴇᴛᴜʀɴᴇᴅ ᴀɴ ɪɴᴠᴀʟɪᴅ ʀᴇsᴘᴏɴsᴇ ᴏʀ ɪs ᴏғғʟɪɴᴇ.");
      }

      const { all, img1, img2, img3, img4 } = apiRes.data;
      const cacheDir = path.join(__dirname, "cache");

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
      }

      const filePath = path.join(cacheDir, `mj_grid_${Date.now()}.jpg`);
      const imageRes = await axios({
        method: "GET",
        url: all,
        responseType: "arraybuffer",
        timeout: 300000
      }).catch(() => null);

      if (!imageRes || !imageRes.data) {
        if (loading?.messageID) api.unsendMessage(loading.messageID);
        return message.reply("❌ ғᴀɪʟᴇᴅ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ ɢʀɪᴅ ɪᴍᴀɢᴇ.");
      }

      await sharp(imageRes.data)
        .jpeg({ quality: 95 })
        .toFile(filePath);

      if (loading?.messageID) {
        api.unsendMessage(loading.messageID);
      }

      await api.sendMessage({
        body: `✨ ᴍɪᴅᴊᴏᴜʀɴᴇʏ ᴀɪ ✨\n\n🖼️ ɢʀɪᴅ ${isEditMode ? "ᴇᴅɪᴛ" : "ɪᴍᴀɢᴇ"} ɢᴇɴᴇʀᴀᴛᴇᴅ!\n🪐 ᴍᴏᴅᴇ: ᴍɪᴅᴊᴏᴜʀɴᴇʏ ${isEditMode ? "ᴘʀᴇᴍɪᴜᴍ ᴇᴅɪᴛ" : "ᴘʀᴇᴍɪᴜᴍ ɢᴇɴ"}\n\n📥 ʀᴇᴘʟʏ ᴛᴏ ᴛʜɪs ᴍᴇssᴀɢᴇ ᴡɪᴛʜ ᴀ ɴᴜᴍʙᴇʀ (1, 2, 3, 4) ᴛᴏ ɢᴇᴛ ʏᴏᴜʀ sɪɴɢʟᴇ 4ᴋ ɪᴍᴀɢᴇ.`,
        attachment: fs.createReadStream(filePath)
      }, threadID, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            img1, img2, img3, img4
          });
        }
      }, messageID);

      setTimeout(() => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, 15000);
    } catch (e) {
      console.error(e);
      if (loading?.messageID) api.unsendMessage(loading.messageID);
      message.reaction("💔", messageID);
      return message.reply("💔 sʏsᴛᴇᴍ ᴇʀʀᴏʀ. ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.");
    }
  },

  onReply: async function ({ message, event, Reply, api }) {
    const { senderID, threadID, messageID } = event;

    if (senderID !== Reply.author) {
      return message.reply("❌ ᴏɴʟʏ ᴛʜᴇ ᴘʀᴏᴍᴘᴛ ʀᴇǫᴜᴇsᴛᴇʀ ᴄᴀɴ ᴄʜᴏᴏsᴇ ᴛʜᴇ ɪᴍᴀɢᴇ.");
    }

    const choice = event.body.trim();
    if (!["1", "2", "3", "4"].includes(choice)) {
      return message.reply("⚠️ ɪɴᴠᴀʟɪᴅ ᴄʜᴏɪᴄᴇ! ᴘʟᴇᴀsᴇ ʀᴇᴘʟʏ ᴡɪᴛʜ 1, 2, 3, ᴏʀ 4.");
    }

    message.reaction("✨", messageID);
    const selectedImgUrl = Reply[`img${choice}`];
    const loading = await api.sendMessage(
      `📥 ғᴇᴛᴄʜɪɴɢ ɪᴍᴀɢᴇ ${choice}...`,
      threadID
    );

    try {
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
      }

      const filePath = path.join(cacheDir, `mj_single_${Date.now()}.jpg`);
      const imageRes = await axios({
        method: "GET",
        url: selectedImgUrl,
        responseType: "arraybuffer",
        timeout: 300000
      }).catch(() => null);

      if (!imageRes || !imageRes.data) {
        if (loading?.messageID) api.unsendMessage(loading.messageID);
        return message.reply("❌ ғᴀɪʟᴇᴅ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ ᴛʜᴇ sᴇʟᴇᴄᴛᴇᴅ ɪᴍᴀɢᴇ.");
      }

      await sharp(imageRes.data)
        .jpeg({ quality: 95 })
        .toFile(filePath);

      if (loading?.messageID) {
        api.unsendMessage(loading.messageID);
      }

      await message.reply({
        body: `✅ ɪᴍᴀɢᴇ ${choice} ᴄᴏᴍᴘʟᴇᴛᴇ!`,
        attachment: fs.createReadStream(filePath)
      }, threadID);

      global.GoatBot.onReply.delete(Reply.messageID);

      setTimeout(() => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, 15000);
    } catch (e) {
      console.error(e);
      if (loading?.messageID) api.unsendMessage(loading.messageID);
      return message.reply("💔 ғᴀɪʟᴇᴅ ᴛᴏ ᴘʀᴏᴄᴇss ʏᴏᴜʀ sᴇʟᴇᴄᴛɪᴏɴ.");
    }
  }
};
