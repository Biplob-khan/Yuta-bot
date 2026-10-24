const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
	config: {
		name: "login",
		version: "2.0",
		author: "Biplob",
		countDown: 3,
		role: 0,
		shortDescription: "Fake login prank banner for mentioned user",
		longDescription: "যাকে মেনশন করবেন তার অ্যাকাউন্ট লগইন করার একটি প্র্যাঙ্ক স্ক্রিনশট/ব্যানার বানিয়ে দিবে",
		category: "fun",
		guide: "{p}login @mention"
	},

	onStart: async ({ message, event }) => {
		const mentions = Object.keys(event.mentions);

		// কাউকে মেনশন না করলে ওয়ার্নিং দেবে
		if (mentions.length === 0) {
			return message.reply("⚠️ যার অ্যাকাউন্ট লগইন করতে চান তাকে মেনশন করুন!\nযেমন: !login @user");
		}

		const targetID = mentions[0];
		const targetName = event.mentions[targetID].replace("@", "");
		const imgPath = path.join(__dirname, "cache", `login_${targetID}.png`);

		try {
			// টার্গেট ইউজারের প্রোফাইল পিকচার আনা
			const avatarUrl = `https://graph.facebook.com/${targetID}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
			const avatar = await loadImage(avatarUrl);

			// ক্যানভাস সাইজ (৭০০x৪০০ - ডার্ক মোড লগইন ইন্টারফেস)
			const canvas = createCanvas(700, 400);
			const ctx = canvas.getContext("2d");

			// ডার্ক ব্যাকগ্রাউন্ড (Dark Mode Login UI)
			ctx.fillStyle = "#18191a";
			ctx.fillRect(0, 0, 700, 400);

			// ওপরের হেডার কার্ড (FB Blue Style)
			ctx.fillStyle = "#242526";
			ctx.fillRect(20, 20, 660, 360);

			// সফল লগইন টিক চিহ্ন গ্রিন আইকন
			ctx.fillStyle = "#2e7d32";
			ctx.beginPath();
			ctx.arc(350, 80, 35, 0, Math.PI * 2);
			ctx.fill();

			ctx.font = "bold 40px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.textAlign = "center";
			ctx.fillText("✓", 350, 93);

			// সার্কুলার প্রোফাইল পিকচার
			const radius = 55;
			const avatarX = 350;
			const avatarY = 190;

			ctx.save();
			ctx.beginPath();
			ctx.arc(avatarX, avatarY, radius, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.clip();
			ctx.drawImage(avatar, avatarX - radius, avatarY - radius, radius * 2, radius * 2);
			ctx.restore();

			// প্রোফাইল পিকচারের বর্ডার
			ctx.beginPath();
			ctx.arc(avatarX, avatarY, radius, 0, Math.PI * 2, true);
			ctx.lineWidth = 4;
			ctx.strokeStyle = "#1877f2";
			ctx.stroke();

			// ভিকটিমের নাম
			ctx.font = "bold 22px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText(targetName.length > 20 ? targetName.substring(0, 18) + "..." : targetName, 350, 275);

			// হ্যাকড / লগইন স্ট্যাটাস টেক্সট
			ctx.font = "bold 16px Arial";
			ctx.fillStyle = "#00ff66";
			ctx.fillText("● ACCOUNT LOGGED IN SUCCESSFULLY", 350, 310);

			ctx.font = "14px Arial";
			ctx.fillStyle = "#b0b3b8";
			ctx.fillText(`Device: Termux Server | ID: ${targetID}`, 350, 340);

			// ফাইল সেভ করা
			if (!fs.existsSync(path.join(__dirname, "cache"))) {
				fs.mkdirSync(path.join(__dirname, "cache"));
			}
			const buffer = canvas.toBuffer("image/png");
			fs.writeFileSync(imgPath, buffer);

			// কাস্টম টেক্সট ও স্ক্রিনশট ইমেজ পাঠানো
			return message.reply({
				body: `তোমার Accoun 𝗩𝗶𝗹𝗹𝗮𝗶𝗻 𝗕𝗶𝗽𝗹𝗼𝗕 💋🖤 লগ ইন করতে সফল হয়েছে`,
				mentions: [{ tag: targetName, id: targetID }],
				attachment: fs.createReadStream(imgPath)
			}, () => fs.unlinkSync(imgPath));

		} catch (error) {
			console.error(error);
			if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
			return message.reply("❌ লগইন স্ক্রিনশট তৈরি করতে সমস্যা হয়েছে!");
		}
	}
};
