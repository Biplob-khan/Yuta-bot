const { getTime } = global.utils;
const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
	config: {
		name: "leave",
		version: "2.0",
		author: "NTKhang / Customized",
		category: "events"
	},

	langs: {
		vi: { defaultLeaveMessage: "{userName} đã bị kick khỏi nhóm" },
		en: { defaultLeaveMessage: "{userName} was kicked from the group" }
	},

	onStart: async ({ threadsData, message, event, api, usersData }) => {
		if (event.logMessageType == "log:unsubscribe") {
			return async function () {
				const { threadID } = event;
				const threadData = await threadsData.get(threadID);
				
				if (!threadData.settings.sendLeaveMessage) return;

				const { leftParticipantFbId } = event.logMessageData;

				// বট নিজে কিক খেলে কিছু করবে না
				if (leftParticipantFbId == api.getCurrentUserID()) return;

				// শুধু কিক খেলেই (কেউ নিজে লিভ নিলে কাজ করবে না)
				const isKicked = leftParticipantFbId != event.author;
				if (!isKicked) return;

				const userName = await usersData.getName(leftParticipantFbId);
				const avatarUrl = `https://graph.facebook.com/${leftParticipantFbId}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

				// --- ব্যানার (Image Canvas) তৈরি করার অংশ ---
				const cacheImagePath = path.join(__dirname, "cache", `kick_${leftParticipantFbId}.png`);
				await fs.ensureDir(path.join(__dirname, "cache"));

				try {
					const canvas = createCanvas(800, 360);
					const ctx = canvas.getContext("2d");

					// ব্যাকগ্রাউন্ড কালার/ডিজাইন
					const gradient = ctx.createLinearGradient(0, 0, 800, 360);
					gradient.addColorStop(0, "#1a1c20");
					gradient.addColorStop(1, "#0f1015");
					ctx.fillStyle = gradient;
					ctx.fillRect(0, 0, 800, 360);

					// কার্ড ব্যাকগ্রাউন্ড
					ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
					ctx.roundRect(30, 30, 740, 300, 20);
					ctx.fill();

					// ইউজার প্রফাইল পিকচার (গোল করে কাটা)
					let avatar;
					try {
						avatar = await loadImage(avatarUrl);
					} catch (e) {
						// প্রফাইল পিকচার না পাওয়া গেলে ডিফল্ট ইমেজ
						avatar = await loadImage("https://i.imgur.com/2ydR12o.png");
					}

					ctx.save();
					ctx.beginPath();
					ctx.arc(150, 180, 80, 0, Math.PI * 2, true);
					ctx.closePath();
					ctx.clip();
					ctx.drawImage(avatar, 70, 100, 160, 160);
					ctx.restore();

					// প্রফাইল বর্ডার
					ctx.strokeStyle = "#ff4757";
					ctx.lineWidth = 5;
					ctx.beginPath();
					ctx.arc(150, 180, 82, 0, Math.PI * 2, true);
					ctx.stroke();

					// মেসেজ টেক্সট: "ধন্যবাদ আবার আসবেন"
					ctx.fillStyle = "#ffffff";
					ctx.font
