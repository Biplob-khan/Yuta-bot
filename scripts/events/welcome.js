const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "welcome",
    version: "3.0",
    author: "Yuta/Biplob",
    category: "events"
  },

  onStart: async function ({ api, event }) {
    // শুধুমাত্র নতুন মেম্বার যুক্ত হওয়ার ইভেন্ট হ্যান্ডেল করবে
    if (event.logMessageType !== "log:subscribe") return;

    const { threadID, logMessageData } = event;
    const newUsers = logMessageData.addedParticipants;
    const botID = api.getCurrentUserID();

    // বট নিজে গ্রুপে যুক্ত হলে কোনো মেসেজ পাঠাবে না
    if (newUsers.some(u => u.userFbId === botID)) return;

    try {
      // গ্রুপের তথ্য আনা
      const threadInfo = await api.getThreadInfo(threadID);
      const groupName = threadInfo.threadName || "our group";
      const memberCount = threadInfo.participantIDs.length;

      for (const user of newUsers) {
        const userId = user.userFbId;
        const fullName = user.fullName;

        // বাংলাদেশ সময় ফরম্যাট
        const timeStr = new Date().toLocaleString("en-BD", {
          timeZone: "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          weekday: "long",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour12: true
        });

        // ক্যাশ ফোল্ডার তৈরি
        const cacheDir = path.join(__dirname, "..", "cache");
        await fs.ensureDir(cacheDir);
        const imagePath = path.join(cacheDir, `welcome_${userId}.png`);

        // আপনার Vercel Dynamic Image API Link
        // (আপনার Deploy করা Vercel Domain টি এখানে বসাতে পারেন)
        const apiUrl = `https://your-vercel-domain.vercel.app/api/welcome?name=${encodeURIComponent(fullName)}&uid=${userId}&threadname=${encodeURIComponent(groupName)}&members=${memberCount}`;

        let hasAttachment = false;

        try {
          // ইমেজ ডাউনলোড করা
          const response = await axios.get(apiUrl, {
            responseType: "arraybuffer",
            timeout: 12000
          });

          fs.writeFileSync(imagePath, response.data);
          hasAttachment = true;
        } catch (imgErr) {
          console.error("⚠️ Image generation failed, sending text only message:", imgErr.message);
        }

        // মেসেজ অবজেক্ট
        const messagePayload = {
          body:
            `‎𝐇𝐞𝐥𝐥𝐨 ${fullName}\n` +
            `𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐭𝐨 ${groupName}\n` +
            `𝐘𝐨𝐮'𝐫𝐞 𝐭𝐡𝐞 ${memberCount} 𝐦𝐞𝐦𝐛𝐞𝐫 𝐨𝐧 𝐭𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩, 𝐩𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐣𝐨𝐲 🎉\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `📅 ${timeStr}`,
          mentions: [{ tag: fullName, id: userId }]
        };

        // ছবি ডাউনলোড সফল হলে তা যুক্ত করবে
        if (hasAttachment && fs.existsSync(imagePath)) {
          messagePayload.attachment = fs.createReadStream(imagePath);
        }

        // গ্রুপে মেসেজ ও ছবি সেন্ড করবে
        await api.sendMessage(messagePayload, threadID);

        // ফাইল ডিলিট করে মেমরি খালি করা
        if (hasAttachment && fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    } catch (error) {
      console.error("❌ Error in welcome event:", error);
    }
  }
};
