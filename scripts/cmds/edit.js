const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");

module.exports = {
  config: {
    name: "edit",
    aliases: ["e"],
    version: "2.0.0",
    author: "Arafat Sarder",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "AI Image Editor"
    },
    category: "image"
  },

  onStart: async function ({ message, event, args, api }) {
    const { messageReply, messageID, threadID, senderID } = event;
    const username = "Public";
    const apiBase = "https://arafatas.vercel.app/edit6";

    try {
      if (args[0] === "-balance" || args[0] === "-bal") {
        try {
          const res = await axios.get(`${apiBase}/credit?username=${username}`, { timeout: 10000 });
          const data = res.data;
          
          let msg = `• Hᴇᴀʀ ɪs ʏᴏᴜʀ ʙᴀʟᴀɴᴄᴇ sᴛᴀᴛᴜs ʙᴀʙᴀʏ <'3\n\n`;
          msg += `• Tᴏᴛᴀʟ: ${data.credits} CR\n`;
          msg += `• Tᴏᴛᴀʟ Usᴇ: ${data.status === "active" ? "Aᴄᴛɪᴠᴇ" : "Iɴsᴜғғɪᴄɪᴇɴᴛ"}`;
          
          return message.reply(msg);
        } catch (error) {
          return message.reply(`• Hᴇᴀʀ ɪs ʏᴏᴜʀ ʙᴀʟᴀɴᴄᴇ sᴛᴀᴛᴜs ʙᴀʙᴀʏ <'3\n\n❌ Fᴀɪʟᴇᴅ`);
        }
      }

      if (!messageReply || !messageReply.attachments || messageReply.attachments[0].type !== "photo") {
        let msg = `• Hᴇᴀʀ ɪs ʏᴏᴜʀ ᴇᴅɪᴛ ɪᴍɢ ʙᴀʙᴀʏ <'3\n\n`;
        msg += `📸 Rᴇᴘʟʏ ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ\n`;
        msg += `edit -g2 ᴇɴʜᴀɴᴄᴇ\n\n`;
        msg += `🎯 Mᴏᴅᴇʟs:\n`;
        msg += `-n  Nᴀɴᴏʙᴀɴᴀɴᴀ 2.5\n`;
        msg += `-n2 Nᴀɴᴏʙᴀɴᴀɴᴀ 3.1\n`;
        msg += `-s  Sᴇᴇᴅʀᴇᴀᴍ 4.0\n`;
        msg += `-s2 Sᴇᴇᴅʀᴇᴀᴍ 4.5\n`;
        msg += `-s3 Sᴇᴇᴅʀᴇᴀᴍ 5.0\n`;
        msg += `-g  GPT 1.5\n`;
        msg += `-g2 GPT 2.0\n`;
        msg += `-q  Qᴡᴇɴ Pʟᴜs\n`;
        msg += `-q2 Wᴀɴ 2.7\n`;
        msg += `-q3 Wᴀɴ 2.7 Pʀᴏ\n\n`;
        msg += `📌 Dᴜᴀʟ Iᴍᴀɢᴇ: 2x Cʀᴇᴅɪᴛ\n`;
        msg += `📌 Usᴇ -ʙᴀʟᴀɴᴄᴇ ᴛᴏ ᴄʜᴇᴄᴋ`;
        
        return message.reply(msg);
      }

      if (args.length === 0) {
        return message.reply(`• Hᴇᴀʀ ɪs ʏᴏᴜʀ ᴇᴅɪᴛ ɪᴍɢ ʙᴀʙᴀʏ <'3\n\n⚠️ Pʀᴏᴠɪᴅᴇ ᴘʀᴏᴍᴘᴛ`);
      }

      const modelMap = {
        "-n":   { path: "nanobanana",  name: "Nᴀɴᴏʙᴀɴᴀɴᴀ 2.5", cost: 5 },
        "-n2":  { path: "nanobanana2", name: "Nᴀɴᴏʙᴀɴᴀɴᴀ 3.1", cost: 5 },
        "-s":   { path: "seedream",    name: "Sᴇᴇᴅʀᴇᴀᴍ 4.0",   cost: 5 },
        "-s2":  { path: "seedream2",   name: "Sᴇᴇᴅʀᴇᴀᴍ 4.5",   cost: 10 },
        "-s3":  { path: "seedream3",   name: "Sᴇᴇᴅʀᴇᴀᴍ 5.0",   cost: 5 },
        "-g":   { path: "gpt",         name: "GPT 1.5",        cost: 5 },
        "-g2":  { path: "gpt2",        name: "GPT 2.0",        cost: 10 },
        "-q":   { path: "qwen",        name: "Qᴡᴇɴ Pʟᴜs",      cost: 5 },
        "-q2":  { path: "qwen2",       name: "Wᴀɴ 2.7",        cost: 5 },
        "-q3":  { path: "qwen3",       name: "Wᴀɴ 2.7 Pʀᴏ",    cost: 5 }
      };

      let modelPath = "nanobanana2";
      let modelName = "Nᴀɴᴏʙᴀɴᴀɴᴀ 3.1";
      let modelCost = 5;
      let prompt = args.join(" ");

      const firstArg = args[0]?.toLowerCase();
      if (modelMap[firstArg]) {
        const target = modelMap[firstArg];
        modelPath = target.path;
        modelName = target.name;
        modelCost = target.cost;
        prompt = args.slice(1).join(" ");
      }

      if (!prompt || prompt.trim().length === 0) {
        return message.reply(`• Hᴇᴀʀ ɪs ʏᴏᴜʀ ᴇᴅɪᴛ ɪᴍɢ ʙᴀʙᴀʏ <'3\n\n⚠️ Pʀᴏᴠɪᴅᴇ ᴘʀᴏᴍᴘᴛ`);
      }

      const hasUrl2 = messageReply.attachments.length > 1 && 
                     messageReply.attachments[1].type === "photo";
      const totalCost = hasUrl2 ? modelCost * 2 : modelCost;

      try {
        const creditCheck = await axios.get(`${apiBase}/credit?username=${username}`, { timeout: 10000 });
        const available = creditCheck.data.credits || 0;

        if (available < totalCost) {
          return message.reply(
`• Hᴇᴀʀ ɪs ʏᴏᴜʀ ᴇᴅɪᴛ ɪᴍɢ ʙᴀʙᴀʏ <'3

❌ Iɴsᴜғғɪᴄɪᴇɴᴛ Cʀᴇᴅɪᴛs
💰 Rᴇǫᴜɪʀᴇᴅ: ${totalCost} CR
📊 Aᴠᴀɪʟᴀʙʟᴇ: ${available} CR`
          );
        }
      } catch (error) {
        return message.reply(`• Hᴇᴀʀ ɪs ʏᴏᴜʀ ᴇᴅɪᴛ ɪᴍɢ ʙᴀʙᴀʏ <'3\n\n❌ Cʀᴇᴅɪᴛ Eʀʀᴏʀ`);
      }

      const url1 = messageReply.attachments[0].url;
      let url2 = "";
      
      if (hasUrl2) {
        url2 = messageReply.attachments[1].url;
      }

      message.reaction("⏳", messageID);

      let finalUrl = `${apiBase}/${modelPath}?url=${encodeURIComponent(url1)}&prompt=${encodeURIComponent(prompt)}&user=${username}`;
      if (url2) {
        finalUrl += `&url2=${encodeURIComponent(url2)}`;
      }

      const response = await axios({
        method: "GET",
        url: finalUrl,
        responseType: "json",
        timeout: 300000
      });

      const imageUrl = response.data?.data?.imageUrl;

      if (!imageUrl) {
        message.reaction("❌", messageID);
        return message.reply(`• Hᴇᴀʀ ɪs ʏᴏᴜʀ ᴇᴅɪᴛ ɪᴍɢ ʙᴀʙᴀʏ <'3\n\n❌ Nᴏ ɪᴍᴀɢᴇ URL`);
      }

      try {
        const imageResponse = await axios({
          method: "GET",
          url: imageUrl,
          responseType: "stream",
          timeout: 60000,
          headers: {
            "User-Agent": "Mozilla/5.0"
          }
        });

        await message.reply({
          body: `• Hᴇᴀʀ ɪs ʏᴏᴜʀ ᴇᴅɪᴛ ɪᴍɢ ʙᴀʙᴀʏ <'3\n\n• Pʀᴏᴍᴘᴛ: ${prompt}`,
          attachment: imageResponse.data
        }, threadID);

        message.reaction("✅", messageID);

      } catch (imageError) {
        message.reaction("❌", messageID);
        return message.reply(`• Hᴇᴀʀ ɪs ʏᴏᴜʀ ᴇᴅɪᴛ ɪᴍɢ ʙᴀʙᴀʏ <'3\n\n❌ Fᴀɪʟᴇᴅ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ`);
      }

    } catch (error) {
      console.error("Edit Error:", error);
      message.reaction("💔", messageID);
      return message.reply(`• Hᴇᴀʀ ɪs ʏᴏᴜʀ ᴇᴅɪᴛ ɪᴍɢ ʙᴀʙᴀʏ <'3\n\n❌ Sʏsᴛᴇᴍ Eʀʀᴏʀ`);
    }
  }
};
