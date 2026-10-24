const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
	config: {
		name: "couple",
		version: "3.0",
		author: "Biplob",
		countDown: 5,
		role: 0,
		shortDescription: "Auto pick 2 members and make a couple banner",
		longDescription: "কমান্ড দিলেই বট নিজে থেকে গ্রুপের যেকোনো ২ জনকে সিলেক্ট করে কাপল ব্যানার বানিয়ে দিবে",
		category: "image",
		guide: "{p}couple"
	},

	onStart: async ({ message, event, api }) => {
		const imgPath = path.join(__dirname, "cache", `couple_${Date.now()}.png`);

		try {
			// গ্রুপের সব মেম্বারদের লিস্ট বের করা
			const threadInfo = await api.getThreadInfo(event.threadID);
			const participantIDs = threadInfo.participantIDs;

			// চেক করা হচ্ছে গ্রুপে অন্তত ২ জন মেম্বার আছে কিনা
			if (participantIDs.length < 2) {
				return message.reply("⚠️ কাপল ব্যানার তৈরি করার জন্য গ্রুপে অন্তত ২ জন মেম্বার থাকতে হবে!");
			}

			// অটোমেটিক ২ জন মেম্বার সিলেক্ট করা (র‍্যান্ডমলি)
			const id1 = participantIDs[Math.floor(Math.random() * participantIDs.length)];
			let id2 = participantIDs[Math.floor(Math.random() * participantIDs.length)];

			// দুইজন যেন একই ব্যক্তি না হয়
			while (id1 === id2) {
				id2 = participantIDs[Math.floor(Math.random() * participantIDs.length)];
			}

			// সিলেক্ট হওয়া ২ জন মেম্বারের নাম বের করা
			const userInfo = await api.getUserInfo([id1, id2]);
			const name1 = userInfo[id1].name || "User 1";
			const name2 = userInfo[id2].name || "User 2";

			// প্রোফাইল পিকচার লোড করা
			const avatarUrl1 = `https://graph.facebook.com/${id1}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
			const avatarUrl2 = `https://graph.facebook.com/${id2}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

			const avatar1 = await loadImage(avatarUrl1);
			const avatar2 = await loadImage(avatarUrl2);

			// ক্যানভাস সাইজ (৮০০x৪০০)
			const canvas = createCanvas(800, 400);
			const ctx = canvas.getContext("2d");

			// ব্যাকগ্রাউন্ড (Romantic Gradient)
			const gradient = ctx.createLinearGradient(0, 0, 800, 400);
			gradient.addColorStop(0, "#ff758c");
			gradient.addColorStop(1, "#ff7eb3");
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, 800, 400);

			// ব্যাকগ্রাউন্ড ডেকোরেশন
			ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
			ctx.beginPath();
			ctx.arc(400, 200, 280, 0, Math.PI * 2);
			ctx.fill();

			// গোলাকার প্রোফাইল পিকচার আঁকার ফাংশন
			function drawCircularAvatar(img, x, y, radius) {
				ctx.save();
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.clip();
				ctx.drawImage(img, x - radius, y - radius, radius * 2, radius * 2);
				ctx.restore();

				// পিকচারের সাদা বর্ডার
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, Math.PI * 2, true);
				ctx.lineWidth = 6;
				ctx.strokeStyle = "#ffffff";
				ctx.stroke();
			}

			// ইউজার ১ পিকচার (বামপাশে)
			drawCircularAvatar(avatar1, 220, 180, 90);

			// ইউজার ২ পিকচার (ডানপাশে)
			drawCircularAvatar(avatar2, 580, 180, 90);

			// মাঝখানে লাভ ইমোজি
			ctx.font = "bold 60px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.textAlign = "center";
			ctx.fillText("💖", 400, 195);

			// টাইটেল
			ctx.font = "bold 32px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText("PERFECT COUPLE", 400, 60);

			// মেম্বারদের নাম লেখা
			ctx.font = "bold 22px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText(name1.length > 15 ? name1.substring(0, 12) + "..." : name1, 220, 310);
			ctx.fillText(name2.length > 15 ? name2.substring(0, 12) + "..." : name2, 580, 310);

			// লাভ পার্সেন্টেজ (৮০% - ১০০%)
			const loveScore = Math.floor(Math.random() * 21) + 80;
			ctx.font = "italic 20px Arial";
			ctx.fillStyle = "#fff5f8";
			ctx.fillText(`Love Match: ${loveScore}%`, 400, 360);

			// ইমেজ ফাইল সেভ করা
			if (!fs.existsSync(path.join(__dirname, "cache"))) {
				fs.mkdirSync(path.join(__dirname, "cache"));
			}
			const buffer = canvas.toBuffer("image/png");
			fs.writeFileSync(imgPath, buffer);

			// নাম মেনশনসহ মেসেজ ও ব্যানার ইমেজ পাঠানো
			return message.reply({
				body: `👩‍❤️‍👨 ─── [ 𝗥𝗢𝗠𝗔𝗡𝗧𝗜𝗖 𝗖𝗢𝗨𝗣𝗟𝗘 ] ─── 👩‍❤️‍👨\n\n` +
				      `💞 **${name1}** ➕ **${name2}**\n` +
				      `✨ আজ বটের বিচারে তোমরাই সেরা জুটি!`,
				mentions: [
					{ tag: name1, id: id1 },
					{ tag: name2, id: id2 }
				],
				attachment: fs.createReadStream(imgPath)
			}, () => fs.unlinkSync(imgPath));

		} catch (error) {
			console.error(error);
			if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
			return message.reply("❌ কাপল ব্যানার তৈরি করতে সমস্যা হয়েছে! নিশ্চিত করুন canvas প্যাকেজ ইনস্টল আছে।");
		}
	}
};
