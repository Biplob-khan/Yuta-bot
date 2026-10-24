const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = path = require("path");

module.exports = {
	config: {
		name: "hack",
		version: "1.0",
		author: "Customized",
		countDown: 5,
		role: 0,
		shortDescription: "Fun fake hack banner",
		longDescription: "Mention someone to create a danger theme fake hacked banner",
		category: "fun",
		guide: "{p}hack @mention"
	},

	onStart: async ({ api, event, args, message, usersData }) => {
		const { mentions, senderID } = event;
		
		// মেনশন করা আইডি খুঁজে বের করা
		let targetID = Object.keys(mentions)[0];
		if (!targetID) {
			return message.reply("দয়া করে যাকে Hack করতে চান তাকে মেনশন করুন!");
		}

		const userName = await usersData.getName(targetID);
		const avatarUrl = `https://graph.facebook.com/${targetID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

		const cacheImagePath = path.join(__dirname, "cache", `hacked_${targetID}.png`);
		await fs.ensureDir(path.join(__dirname, "cache"));

		try {
			// ক্যানভাস সাইজ (800x400)
			const canvas = createCanvas(800, 400);
			const ctx = canvas.getContext("2d");

			// ব্যাকগ্রাউন্ড - ডার্ক রেড ও ব্ল্যাক গ্রেডিয়েন্ট (Danger Look)
			const gradient = ctx.createLinearGradient(0, 0, 800, 400);
			gradient.addColorStop(0, "#0d0000");
			gradient.addColorStop(0.5, "#2b0000");
			gradient.addColorStop(1, "#000000");
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, 800, 400);

			// লাল রঙের বর্ডার (Border Frame)
			ctx.strokeStyle = "#ff0000";
			ctx.lineWidth = 8;
			ctx.strokeRect(15, 15, 770, 370);

			// ভিকটিমের প্রোফাইল পিকচার (গোল ফ্রেমে)
			let avatar;
			try {
				avatar = await loadImage(avatarUrl);
			} catch (e) {
				avatar = await loadImage("https://i.imgur.com/2ydR12o.png");
			}

			ctx.save();
			ctx.beginPath();
			ctx.arc(160, 200, 85, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.clip();
			ctx.drawImage(avatar, 75, 115, 170, 170);
			ctx.restore();

			// প্রোফাইলের লাল গ্লো বর্ডার
			ctx.strokeStyle = "#ff0033";
			ctx.lineWidth = 6;
			ctx.beginPath();
			ctx.arc(160, 200, 87, 0, Math.PI * 2, true);
			ctx.stroke();

			// "SYSTEM HACKED" হেডার
			ctx.fillStyle = "#ff0000";
			ctx.font = "bold 42px Sans-serif";
			ctx.fillText("⚠️ SYSTEM HACKED ⚠️", 280, 110);

			// ভিকটিমের নাম
			ctx.fillStyle = "#ffffff";
			ctx.font = "bold 32px Sans-serif";
			ctx.fillText(`Target: ${userName}`, 280, 180);

			// বাইপাস স্ট্যাটাস টেক্সট
			ctx.fillStyle = "#ff4d4d";
			ctx.font = "20px Monospace";
			ctx.fillText("Status: Security Bypassed 100%", 280, 230);
			ctx.fillText("Access: Full Device Control Granted", 280, 260);

			// নিচ দিয়ে লাল সতর্কবার্তা
			ctx.fillStyle = "#ff0000";
			ctx.font = "bold 22px Sans-serif";
			ctx.fillText("BY: VILLAIN BIPLOB", 280, 320);

			// ইমেজ সেভ করা
			const buffer = canvas.toBuffer("image/png");
			await fs.writeFile(cacheImagePath, buffer);

			// মেসেজ পাঠানো
			await message.send({
				body: `𝗬𝗼𝘂'𝗿𝗲 𝗛𝗮𝗰𝗸𝗲𝗱 𝗕𝘆 𝗩𝗶𝗹𝗹𝗮𝗶𝗻 𝗕𝗶𝗽𝗹𝗼𝗯 💋💥\n\n@${userName}`,
				mentions: [{ id: targetID, tag: userName }],
				attachment: fs.createReadStream(cacheImagePath)
			});

			// ফাইল মুছে ফেলা
			if (fs.existsSync(cacheImagePath)) {
				fs.unlinkSync(cacheImagePath);
			}

		} catch (err) {
			console.error(err);
			message.reply("ব্যানার তৈরি করতে সমস্যা হয়েছে!");
		}
	}
};

