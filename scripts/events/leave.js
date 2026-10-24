Const { getTime, drive } = global.utils;

Module.exports = {
	Config: {
		Name: "leave",
		Version: "1.5",
		Author: "Yuta/Biplob",
		Category: "events"
	},

	Langs: {
		Vi: {
			Session1: "sáng",
			Session2: "trưa",
			Session3: "chiều",
			Session4: "tối",
			LeaveType1: "tự rời",
			LeaveType2: "bị kick",
			DefaultLeaveMessage: "{userName} đã {type} khỏi nhóm"
		},
		En: {
			Session1: "morning",
			Session2: "noon",
			Session3: "afternoon",
			Session4: "evening",
			LeaveType1: "left",
			LeaveType2: "was kicked from",
			DefaultLeaveMessage: "{userName} {type} the group"
		}
	},

	OnStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
		If (event.logMessageType == "log:unsubscribe")
			Return async function () {
				Const { threadID } = event;
				Const threadData = await threadsData.get(threadID);
				If (!threadData.settings.sendLeaveMessage)
					Return;

				Const { leftParticipantFbId } = event.logMessageData;
				
				// বট নিজে লিভ নিলে বা কিক খেলে যেন রিঅ্যাক্ট না করে
				If (leftParticipantFbId == api.getCurrentUserID())
					Return;

				// ১. ব্যবহারকারীকে পুনরায় গ্রুপে এড (Re-add) করার অংশ
				Try {
					Await api.addUserToGroup(leftParticipantFbId, threadID);
				} catch (err) {
					Console.log(`Error re-adding user ${leftParticipantFbId}:`, err);
				}

				// ২. কাস্টম মেসেজ পাঠানোর অংশ
				Const userName = await usersData.getName(leftParticipantFbId);
				Const hours = getTime("HH");
				Const threadName = threadData.threadName;

				// কাস্টম মেসেজ
				Let leaveMessage = "আমি YuTa থাকতে কেউ পালাতে পারবে না";

				Const form = {
					Body: leaveMessage,
					Mentions: [{
						Tag: userName,
						Id: leftParticipantFbId
					}]
				};

				// যদি কোনো মিডিয়া/অ্যাটাচমেন্ট থাকে
				If (threadData.data.leaveAttachment) {
					Const files = threadData.data.leaveAttachment;
					Const attachments = files.reduce((acc, file) => {
						Acc.push(drive.getFile(file, "stream"));
						Return acc;
					}, []);
					Form.attachment = (await Promise.allSettled(attachments))
						.filter(({ status }) => status == "fulfilled")
						.map(({ value }) => value);
				}

				Message.send(form);
			};
	}
};
