module.exports = {
	config: {
		name: "badwordwarning",
		version: "1.0",
		author: "Biplob",
		countDown: 2,
		role: 0,
		shortDescription: "Auto warning for bad words",
		longDescription: "Group a kharap ba galagali diley automatic warning dibe",
		category: "group",
		guide: "Auto trigger when bad words are used"
	},

	onChat: async ({ message, event }) => {
		if (!event.body) return;

		const text = event.body.toLowerCase().trim();

		// খারাপ বা গালিগালাজের শব্দের তালিকা (আপনার প্রয়োজনমতো আরও শব্দ যোগ করতে পারেন)
		const badWords = [
			"gali", "Khankirpola", "bastard", "stupid", "idiot", 
			"bokachoda", "madarchod", "khanki", "magi", "chudi"
		];

		// মেসেজে কোনো খারাপ শব্দ আছে কিনা তা চেক করা
		const hasBadWord = badWords.some(word => text.includes(word));

		if (hasBadWord) {
			return message.reply({
				body: `⚠️ ─── [ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 ] ─── ⚠️\n\n` +
				`🚫 **সাবধান!** গ্রুপে খারাপ বা অশালীন ভাষা ব্যবহার করা নিষেধ।\n\n` +
				`👉 অনুগ্রহ করে মার্জিত ভাষা ব্যবহার করুন, অন্যথায় গ্রুপ থেকে রিমুভ করা হতে পারে! ❌`
			});
		}
	}
};
