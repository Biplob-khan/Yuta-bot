module.exports = {
	config: {
		name: "salam",
		version: "1.0",
		author: "Biplob",
		countDown: 3,
		role: 0,
		shortDescription: "Auto reply to Salam with video",
		longDescription: "Salam dile automatic reply ebong islamic video dibe",
		category: "islamic",
		guide: "Auto trigger when someone says Salam"
	},

	// জেনুইন সালামের বার্তা ডিটেক্ট করার জন্য onChat ব্যবহার করা হয়েছে
	onChat: async ({ message, event }) => {
		if (!event.body) return;

		const text = event.body.toLowerCase().trim();

		// বিভিন্ন উপায়ে লেখা বাংলা ও ইংরেজি সালামের তালিকা
		const salamKeywords = [
			"assalamu alaikum",
			"assalamu walaikum",
			"assalamualaikum",
			"assalamu alaikum wr wb",
			"assalamu alaikum wa rahmatullah",
			"salam",
			"slam",
			"আসসালামু আলাইকুম",
			"আসসালামু আলাইকুম ওয়া রহমাতুল্লাহ",
			"সালামু আলাইকুম",
			"সালাম"
		];

		// মেসেজে সালামের কিওয়ার্ড আছে কিনা চেক করা
		const isSalam = salamKeywords.some(keyword => text === keyword || text.startsWith(keyword));

		if (isSalam) {
			// ইসলামি ভিডিওর শর্টস / রিলস লিঙ্ক
			const islamicVideos = [
				"https://www.youtube.com/shorts/k81_s28mFkA",
				"https://www.youtube.com/shorts/3fVnQ3s7Q-0",
				"https://www.youtube.com/shorts/93C8-yG4Ovg"
			];

			// র‍্যান্ডম একটি ভিডিও সিলেক্ট করা
			const randomVideo = islamicVideos[Math.floor(Math.random() * islamicVideos.length)];

			return message.reply({
				body: `𝗪𝗮𝗹𝗮𝗶𝗸𝘂𝗺 𝗦𝗮𝗹𝗮𝗺 🖤\n\n🎥 **Islamic Video:**\n${randomVideo}`
			});
		}
	}
};

