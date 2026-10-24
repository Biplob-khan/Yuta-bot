module.exports = {
	config: {
		name: "reaction",
		version: "1.0",
		author: "Yuta / Biplob",
		category: "events"
	},

	onStart: async ({ event, message, usersData, api }) => {
		// শুধু রিঅ্যাকশন ইভেন্ট হলে কাজ করবে (message_reaction)
		if (event.type === "message_reaction") {
			return async function () {
				const { reaction, userID, senderID } = event;

				// যদি রিঅ্যাক্টদাতা বট নিজে হয়, তবে কিছু করবে না
				if (userID === api.getCurrentUserID()) return;

				// রিঅ্যাক্টদাতার নাম সংগ্রহ
				const userName = await usersData.getName(userID);

				// বিভিন্ন রিঅ্যাক্টের জন্য আলাদা মেসেজ/উত্তর
				const reactionResponses = {
					"❤": [
						`অসংখ্য ধন্যবাদ সুন্দর রিঅ্যাক্টটি দেওয়ার জন্য, ${userName}! 🥰❤️`,
						`এত ভালোবাসা দেখে মনটা ভালো হয়ে গেল, ${userName}! ❤️✨`
					],
					"❤️": [
						`অসংখ্য ধন্যবাদ সুন্দর রিঅ্যাক্টটি দেওয়ার জন্য, ${userName}! 🥰❤️`,
						`এত ভালোবাসা দেখে মনটা ভালো হয়ে গেল, ${userName}! ❤️✨`
					],
					"😆": [
						`হাসতে হাসতে শেষ হয়ে গেলে নাকি, ${userName}? 🤣😂`,
						`এত হাসির কী হলো শুনি, ${userName}? 😆`
					],
					"😂": [
						`হাসতে হাসতে শেষ হয়ে গেলে নাকি, ${userName}? 🤣😂`,
						`এত হাসির কী হলো শুনি, ${userName}? 😆`
					],
					"😮": [
						`অবাক হওয়ার মতো কী ঘটলো, ${userName}? 😮🤯`,
						`এত অবাক হলে কীভাবে হবে! 😮`
					],
					"😢": [
						`কষ্ট পেয়ো না, মন খারাপ করো না ${userName}! 🥺💔`,
						`কান্নাকাটি করে লাভ নাই, হাসিখুশি থাকো! 🥺`
					],
					"😡": [
						`এত রাগ দেখাচ্ছ কেন, ${userName}? শান্ত হও! 😡❌`,
						`রাগলে কিন্তু সৌন্দর্য কমে যায়, ${userName}! 😠`
					],
					"👍": [
						`ধন্যবাদ লাইক বা সম্মতি দেওয়ার জন্য, ${userName}! 👍✨`,
						`পারফেক্ট! 👍`
					]
				};

				// যদি নির্দিষ্ট রিঅ্যাক্টটি লিস্টে থাকে
				if (reactionResponses[reaction]) {
					const responses = reactionResponses[reaction];
					const randomMessage = responses[Math.floor(Math.random() * responses.length)];

					return message.send({
						body: randomMessage,
						mentions: [{ tag: userName, id: userID }]
					});
				}
			};
		}
	}
};
