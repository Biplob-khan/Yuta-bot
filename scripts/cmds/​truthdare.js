module.exports = {
	config: {
		name: "truthdare",
		version: "2.0",
		author: "Yuta / Biplob",
		countDown: 5,
		role: 0,
		shortDescription: "Play Romantic Truth or Dare game",
		longDescription: "Play a romantic and love-themed Truth or Dare game with your crush or friends",
		category: "games",
		guide: "{p}truthdare truth OR {p}truthdare dare"
	},

	onStart: async ({ message, args }) => {
		// রোমান্টিক ট্রুথ (সত্যি প্রশ্ন)
		const truths = [
			"তোমার মনের মানুষটি দেখতে কেমন? তার ৩টি বৈশিষ্ট্য বলো যা তোমার সবচেয়ে ভালো লাগে! 💕",
			"প্রথম দেখাতেই প্রেম (Love at first sight)— তুমি কি এতে বিশ্বাস করো?",
			"তোমার জীবনের প্রথম ক্রাশ কে ছিল এবং তাকে দেখে তোমার কেমন অনুভূত হয়েছিল? 🙈",
			"তোমার চোখে ভালোবাসার আসল সংজ্ঞা কী?",
			"কাউকে গোপনে খুব ভালোবাসো কিন্তু কখনো বলতে পারোনি— এমন কেউ আছে কি? 💖",
			"গ্রুপের কার হাসি বা কথা বলার স্টাইল তোমার সবচেয়ে মিষ্টি লাগে?",
			"যদি তোমার ভালোবাসার মানুষের সাথে একা সময় কাটানোর সুযোগ পাও, কোথায় যেতে চাইবে? 🌹",
			"তোমার স্বপ্নের রাজপুত্র/রাজকুমারী কেমন হওয়া উচিত?",
			"কোন মিষ্টি গানটি শুনলে তোমার বিশেষ কারো কথা মনে পড়ে যায়? 🎶"
		];

		// রোমান্টিক ডেয়ার (ভালোবাসার চ্যালেঞ্জ)
		const dares = [
			"গ্রুপের যেকোনো একজনকে মেনশন দিয়ে একটি মিষ্টি ভালোবাসার কবিতা শোনাতো বা লেখো! 💌",
			"তোমার পছন্দের মানুষকে উদ্দেশ্য করে একটি ১০ সেকেন্ডের ভয়েস নোট পাঠাও: 'তুমি খুব মিষ্টি!' 🎙️❤️",
			"গ্রুপের কারো একটি ছবিতে সুন্দর ও রোমান্টিক কমেন্ট করে আসো! ✨",
			"তোমার মেসেঞ্জারে শেষ যাকে রোমান্টিক মেসেজ বা ইমোজি পাঠিয়েছো, তার স্ক্রিনশট দেখাও! 📱💖",
			"একটি রোমান্টিক গানের ২ লাইন গেয়ে ভয়েস মেসেজে পাঠাও! 🎤🎶",
			"তোমার প্রোফাইল বায়ুতে (Bio) ৫ মিনিটের জন্য লেখো: 'In love with someone special... 💖'",
			"গ্রুপের যেকোনো একজনকে ১ মিনিটের জন্য ভালোবাসার মিষ্টি মিষ্টি ৩টি উপাধি দাও! 👑"
		];

		const type = args[0] ? args[0].toLowerCase() : null;

		if (type === "truth" || type === "t") {
			const randomTruth = truths[Math.floor(Math.random() * truths.length)];
			return message.reply(
				`💖 ─── [ 𝗥𝗢𝗠𝗔𝗡𝗧𝗜𝗖 𝗧𝗥𝗨𝗧𝗛 ] ─── 💖\n\n` +
				`❓ **ভালোবাসার প্রশ্ন:**\n${randomTruth}\n\n` +
				`👉 *মন থেকে একদম সত্যি উত্তর দাও! 🙈*`
			);
		} 
		
		if (type === "dare" || type === "d") {
			const randomDare = dares[Math.floor(Math.random() * dares.length)];
			return message.reply(
				`🌹 ─── [ 𝗥𝗢𝗠𝗔𝗡𝗧𝗜𝗖 𝗗𝗔𝗥𝗘 ] ─── 🌹\n\n` +
				`🎯 **ভালোবাসার চ্যালেঞ্জ:**\n${randomDare}\n\n` +
				`👉 *ভয় না পেয়ে চ্যালেঞ্জটি পূরণ করে তোমার ভালোবাসার প্রকাশ ঘটাও! ✨*`
			);
		}

		// অপশন না দিলে দেখাবে
		return message.reply(
			`❤️ ─── [ 𝗟𝗢𝗩𝗘 𝗧𝗥𝗨𝗧𝗛 𝗢𝗥 𝗗𝗔𝗥𝗘 ] ─── ❤️\n\n` +
			`ভালোবাসার এই খেলায় তোমার পছন্দ বেছে নাও:\n\n` +
			`💌 **Truth খেলতে:** !truthdare truth (বা !truthdare t)\n` +
			`🌹 **Dare খেলতে:** !truthdare dare (বা !truthdare d)`
		);
	}
};
