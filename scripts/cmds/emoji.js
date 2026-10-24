module.exports = {
	config: {
		name: "emoji",
		version: "3.0",
		author: "Yuta / Biplob",
		countDown: 3,
		role: 0,
		shortDescription: "50+ Top Messenger Emojis and Captions",
		longDescription: "Get status and captions based on 50+ most used Messenger emojis",
		category: "fun",
		guide: "{p}emoji [laugh/love/attitude/sad/shy/sleep/respect/angry/party/secret] or leave blank for random"
	},

	onStart: async ({ message, args }) => {
		const emojiData = {
			laugh: {
				name: "Fun & Laugh",
				emojis: "😂 🤣 😆 😅 😄 😁",
				quotes: [
					"😂: হাসতে হাসতে পেটে খিল ধরে যাওয়ার অবস্থা! তোদের ফাজিলমি আর ভালো লাগে না।",
					"🤣: এই ঘটনা শুনে যে না হেসে থাকবে, সে মানুষই না!",
					"😆: আজকের দিনটা এত সুন্দর আর মজার যাবে ভাবতেই পারি নাই!",
					"😅: একটু ভুল হয়ে গেছে ভাই, কিছু মনে করিস না প্লিজ!",
					"😄: সবকিছু ঠিকঠাকমতো হয়ে গেছে, এখন একদম নিশ্চিন্ত!",
					"😁: আমার প্ল্যান পুরো সাকসেসফুল! এখন খালি দেখার পালা।"
				]
			},
			love: {
				name: "Love & Crush",
				emojis: "❤️ 💖 💗 💓 💞 🥰 😍 🤩",
				quotes: [
					"❤️: কিছু মানুষের নাম শুনলেই মনটা একদম ভালো হয়ে যায়!",
					"💖: তুমি আছো বলেই আমার পৃথিবীটা এত সুন্দর!",
					"💗: তোমার মেসেজের অপেক্ষায় সারা দিন বসে থাকি।",
					"💓: তোমাকে দেখলেই হৃদস্পন্দন এক সেকেন্ডের জন্য থেমে যায়!",
					"💞: আমাদের এই সুন্দর সম্পর্কটা সারাজীবন এমনই থাকুক!",
					"🥰: এত কিউট কেন তুমি? তোমাকে দেখলে মন ভালো না হয়ে উপায় নাই!",
					"😍: আজকে তোমাকে যা লাগতেছে না! এক কথায় জাস্ট অসাধারণ!",
					"🤩: তোমার এই লুকটা এক কথায় মাইন্ড ব্লোয়িং!"
				]
			},
			attitude: {
				name: "Attitude & Style",
				emojis: "😎 🔥 ⚡ 💯 👑 🗿",
				quotes: [
					"😎: কারো পছন্দের তালিকায় থাকার শখ নাই, নিজের স্টাইলে চলি!",
					"🔥: আগুনের মতো জ্বলে ওঠো, যাতে শত্রুরা দূর থেকেই ভয় পায়!",
					"⚡: কথায় নয়, কাজে পরিচয় দিই—একদম বিদ্যুৎ বেগে!",
					"💯: কথা একটাই বলব, কিন্তু ১০০% সত্যি বলব!",
					"👑: নিজের রাজত্বে নিজেই রাজা, অন্য কারো হুকুম চলেন না!",
					"🗿: যত তোলপাড়ই হোক, আমি আমার জায়গায় একদম অটল!"
				]
			},
			sad: {
				name: "Emotional & Sad",
				emojis: "🥺 😭 💔 🥀 😔 😿",
				quotes: [
					"🥺: একটু মিষ্টি করে কথা বললে কি এমন ক্ষতি হয় বলো?",
					"😭: এত সুন্দর সারপ্রাইজ দিবা ভাবতে পারি নাই, চোখে পানি চলে আসলো!",
					"💔: যেখানে অবহেলা বেশি, সেখানে আর থাকার কোনো মানে হয় না...",
					"🥀: কিছু সম্পর্ক সময়ের সাথে সাথে ফুল থেকে শুকিয়ে ঝরে যায়...",
					"😔: আজকে মনটা একদমই ভালো নাই, কিছুই ভালো লাগছে না...",
					"😿: আমাকে ছাড়া তোমরা সবাই মজা করতে চলে গেলা?"
				]
			},
			shy: {
				name: "Shy & Secret",
				emojis: "🫣 🙈 🤐 🤫 🫠 😜",
				quotes: [
					"🫣: লজ্জায় চোখ বন্ধ করে ফেললাম, কিন্তু একচোখে চুরি করে দেখলাম!",
					"🙈: ইস! এত লজ্জা দিও না তো, আমি কোথায় মুখ লুকাব?",
					"🤐: পেটে অনেক কথা আছে, কিন্তু এখন মুখ খোলা বারণ!",
					"🤫: চুপ! এই কথাটা যেন ভুলভূলেও আর কেউ না জানে!",
					"🫠: তোমার মিষ্টি কথা শুনে আমি গলে পানি হয়ে যাচ্ছি!",
					"😜: সিরিয়াস হওয়ার কিছু নাই, জাস্ট ফাজিলমি করছিলাম!"
				]
			},
			sleep: {
				name: "Sleep & Shock",
				emojis: "😴 🥱 🧠 🤯 💀 👻",
				quotes: [
					"😴: দুনিয়ার সব প্যারা একপাশে, আর শান্তির ঘুম একপাশে!",
					"🥱: সারা দিন কাজ করতে করতে শরীর আর চলছে না, বাই!",
					"🧠: মাথা খাটিয়ে কাজ করো, খাটুনি এমনিতেই কমে যাবে!",
					"🤯: এই নিউজটা শুনে আমার মাথার ফিউজই উড়ে গেল!",
					"💀: এই ফাজিলমি দেখে আমি হাসতে হাসতে মরে গেলাম!",
					"👻: মাঝরাতে এমন ভূত মার্কা মেসেজ দিচ্ছ কেন ভাই?!"
				]
			},
			respect: {
				name: "Respect & Wishes",
				emojis: "👍 👏 🤝 🤲 🙏 🤞",
				quotes: [
					"👍: একদম পারফেক্ট কাজ হয়েছে, ডান!",
					"👏: তোমার এই সাফল্যের জন্য অনেক অনেক অভিনন্দন!",
					"🤝: ডিল ডান! আশা করি আমাদের কাজ খুব ভালো হবে।",
					"🤲: আল্লাহ তোমার মনের সব ভালো আশা পূরণ করুন।",
					"🙏: যা হয়েছে তার জন্য আমি আন্তরিকভাবে দুঃখিত, ক্ষমা সুন্দর দৃষ্টিতে দেখবে।",
					"🤞: পরীক্ষা বা ইন্টারভিউ যেন খুব ভালো হয়, অল দ্য বেস্ট!"
				]
			},
			angry: {
				name: "Angry & Troll",
				emojis: "💩 🤡 😒 🙄 😡 🤬",
				quotes: [
					"💩: ফালতু বকবক বন্ধ করবি নাকি ঝাড়ুর বাড়ি খাবি?!",
					"🤡: নিজের কান্ডকারখানা দেখে নিজেকেই একটা ক্লাউন মনে হচ্ছে!",
					"😒: ফালতু মানুষের ইগো দেখার একদম সময় নাই আমার!",
					"🙄: তুমি যে কত বড় মিথ্যাবাদী, তা আমার খুব ভালোই জানা আছে!",
					"😡: আমার সাথে ফাজিলমি করার আগে ১০ বার চিন্তা করবা!",
					"🤬: সীমা অতিক্রম করবা না, মেজাজ খারাপ হলে কিন্তু খারাপ হবে!"
				]
			},
			party: {
				name: "Celebration & Vibe",
				emojis: "☕ 🥳 🎁 🎈 🎉",
				quotes: [
					"☕: এক কাপ গরম চা আর সাথে প্রিয় মানুষের মিষ্টি আড্ডা!",
					"🥳: হ্যাপি বার্থডে! আজকের দিনে পার্টি তো মাস্ট!",
					"🎁: তোমার জন্য একটা সারপ্রাইজ গিফট রেডি করেছি!",
					"🎈: জীবনটাকে রঙিন বেলুনের মতো আনন্দে উড়িয়ে দাও!",
					"🎉: অবশেষে আমরা জিতে গেলাম! সেলিব্রেশন শুরু করা যাক!"
				]
			}
		};

		const type = args[0]?.toLowerCase();

		// যদি নির্দিষ্ট ক্যাটাগরি ইনপুট দেয়া হয়
		if (type && emojiData[type]) {
			const selected = emojiData[type];
			const randomQuote = selected.quotes[Math.floor(Math.random() * selected.quotes.length)];
			return message.reply(
				`✨ **Category:** ${selected.name}\n` +
				`🎭 **Emojis:** ${selected.emojis}\n\n` +
				`💬 ${randomQuote}`
			);
		}

		// ইনপুট না দিলে র‍্যান্ডম জেনারেট হবে
		const keys = Object.keys(emojiData);
		const randomKey = keys[Math.floor(Math.random() * keys.length)];
		const randomCategory = emojiData[randomKey];
		const randomQuote = randomCategory.quotes[Math.floor(Math.random() * randomCategory.quotes.length)];

		let response = `🔥 ──── [ 50+ EMOJI QUOTES ] ──── 🔥\n\n`;
		response += `🏷️ **Category:** ${randomCategory.name}\n`;
		response += `🎭 **Emojis:** ${randomCategory.emojis}\n\n`;
		response += `💬 ${randomQuote}\n\n`;
		response += `📌 **Available Categories:**\n`;
		response += `• {p}emoji laugh $\\rightarrow$ হাসির কথা\n`;
		response += `• {p}emoji love $\\rightarrow$ ভালোবাসার মেসেজ\n`;
		response += `• {p}emoji attitude $\\rightarrow$ স্টাইল ও ইগো\n`;
		response += `• {p}emoji sad $\\rightarrow$ ইমোশনাল ও কান্না\n`;
		response += `• {p}emoji shy $\\rightarrow$ লজ্জা ও সিক্রেট\n`;
		response += `• {p}emoji sleep $\\rightarrow$ অলসতা ও শকড\n`;
		response += `• {p}emoji respect $\\rightarrow$ সম্মান ও উইশ\n`;
		response += `• {p}emoji angry $\\rightarrow$ রাগ ও ফাজিলমি\n`;
		response += `• {p}emoji party $\\rightarrow$ পার্টি ও বার্থডে`;

		return message.reply(response);
	}
};
