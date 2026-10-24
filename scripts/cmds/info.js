module.exports = {
	config: {
		name: "info",
		version: "1.0",
		author: "Customized",
		countDown: 5,
		role: 0,
		shortDescription: "Get user information",
		longDescription: "Mention someone to see their detailed profile information",
		category: "utility",
		guide: "{p}info @mention (or use without mention for your own info)"
	},

	onStart: async ({ api, event, message, usersData }) => {
		const { mentions, senderID } = event;

		// মেনশন করা আইডি থাকলে সেটি নেবে, না থাকলে যে মেসেজ দিয়েছে তার আইডি নেবে
		let targetID = Object.keys(mentions)[0] || senderID;

		try {
			// ব্যবহারকারীর তথ্য সংগ্রহ
			const userData = await usersData.get(targetID);
			const userName = userData.name || await usersData.getName(targetID);
			const gender = userData.gender == 1 ? "Female (নারী)" : userData.gender == 2 ? "Male (পুরুষ)" : "Not Specified";
			const profileUrl = `https://www.facebook.com/${targetID}`;
			const avatarUrl = `https://graph.facebook.com/${targetID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

			// তথ্য সাজিয়ে টেক্সট মেসেজ তৈরি
			const infoMessage = 
				`📋 ──── [ USER INFO ] ──── 📋\n\n` +
				`👤 Name: ${userName}\n` +
				`🆔 ID: ${targetID}\n` +
				`⚧ Gender: ${gender}\n` +
				`🌐 Profile Link: ${profileUrl}\n\n` +
				`✨ Requested Profile Info`;

			// প্রোফাইল পিকচার অ্যাটাচমেন্টসহ মেসেজ পাঠানো
			await message.send({
				body: infoMessage,
				mentions: [{ id: targetID, tag: userName }],
				attachment: await global.utils.getStreamFromURL(avatarUrl)
			});

		} catch (err) {
			console.error(err);
			message.reply("ইউজারের তথ্য খুঁজে পাওয়া যায়নি!");
		}
	}
};
