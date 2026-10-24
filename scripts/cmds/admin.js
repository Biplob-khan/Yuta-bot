const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "admin",
		version: "2.1",
		author: "Yuta / Biplob",
		countDown: 5,
		role: 0,
		shortDescription: "Display bot and admin/owner details",
		longDescription: "Shows details, contacts, and profile info of the bot owner",
		category: "info",
		guide: "{p}admin"
	},

	onStart: async ({ message }) => {
		const botName = "𝗬𝘂𝗧𝗮 6𝗧9";
		const ownerName = "𝗩𝗶𝗹𝗹𝗮𝗶𝗻 𝗕𝗶𝗽𝗹𝗼𝗯";
		const district = "𝗦𝗶𝗿𝗮𝗷𝗴𝗮𝗻𝗷";
		const adminUid = "𝗩𝗶𝗹𝗲𝗻𝗯𝗶𝗽𝗹𝗼𝗯007";
		const bio = "Love is Name Sex Is game!💋💥";

		// আপনার দেওয়া পিকচারের পাথ (একই ফোল্ডারে admin.jpg নামে রাখবেন)
		const imagePath = path.join(__dirname, "admin.jpg");

		const adminMessage = 
			`🤖 ──── [ BOT & OWNER INFO ] ──── 👑\n\n` +
			`🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲 : ${botName}\n` +
			`👑 𝗢𝘄𝗻𝗲𝗿 : ${ownerName}\n` +
			`🏡 𝗗𝗶𝘀𝘁𝗿𝗶𝗰𝘁 : ${district}\n` +
			`🆔 𝗔𝗱𝗺𝗶𝗻 𝘂𝗶𝗱 : ${adminUid}\n` +
			`🌐 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 : https://facebook.com/${adminUid}\n\n` +
			`📝 𝗕𝗶𝗼 : "${bio}"\n\n` +
			`✨ Contact the owner for any bot-related issues or inquiries!`;

		try {
			if (fs.existsSync(imagePath)) {
				// ছবি থাকলে সেটি স্ট্রিম করে পাঠাবে
				await message.send({
					body: adminMessage,
					attachment: fs.createReadStream(imagePath)
				});
			} else {
				// ছবি না থাকলে ফেসবুক প্রোফাইল পিকচার চেষ্টা করবে
				const avatarUrl = `https://graph.facebook.com/${adminUid}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
				await message.send({
					body: adminMessage,
					attachment: await global.utils.getStreamFromURL(avatarUrl)
				});
			}
		} catch (err) {
			console.error("Error sending admin info:", err);
			message.send(adminMessage);
		}
	}
};
