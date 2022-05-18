import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInterface } from "../interfaces/CommandInterface";
import { MessageActionRow, MessageButton, MessageEmbed, ColorResolvable, TextChannel, Message} from "discord.js";
import { getSubscribers, isAdmin } from "../modules/users";

export const schedule: CommandInterface = {
	data: new SlashCommandBuilder()
		.setName("schedule")
		.setDescription("Schedules 10man!")
		.addStringOption((option) => option.setName("time").setDescription("Enter a Time (20:30)").setRequired(true)) as SlashCommandBuilder,

	run: async (interaction) => {
		if (!interaction.channel) return;

		const admin = await isAdmin(interaction.user.id);
		if (!admin) {
			// Missing Perms
			var deniedEmbed = new MessageEmbed()
				.setColor("0xFF6F00" as ColorResolvable)
				.setTitle("Permission Denied")
				.setDescription("Must be an Admin");

			await interaction.reply({
				embeds: [deniedEmbed],
				ephemeral: true,
			});
			return;
		}

		const subscribers = await getSubscribers();

		let mentionSubs = " ";
		if (subscribers) {
			subscribers.forEach((element) => {
				mentionSubs += "<@" + element.id + "> ";
			});
		}

		const yesEntry: string[] = [];
		const noEntry: string[] = [];

		const timeScheduled = interaction.options.getString("time")!;
		const [countdownHour, countdownMinute, totalMinutes, epochTime] = getCountdown(timeScheduled);

		const epochTimeAsDate = epochTime as Date;

		const epochTimeStr = String(epochTimeAsDate.getTime()).slice(0, -3);

		// Embed
		const mainEmbed = new MessageEmbed()
			.setColor("0xFF6F00" as ColorResolvable)
			.setTitle("10 Man")
			.setURL("https://10man.commoncrayon.com/")
			.setDescription("Join a 10 Man!")
			.addFields(
				{ name: "Time:", value: `<t:${epochTimeStr}>` },
				{
					name: "🔄 Countdown:",
					value: `Starting in ${countdownHour}H ${countdownMinute}M`,
				},
				{ name: "__Yes:__", value: "Empty", inline: true },
				{ name: "__No:__", value: "Empty", inline: true }
			)
			.setFooter({
				text: "Server IP: connect crayon.csgo.fr:27015; password fun",
				iconURL: "https://i.imgur.com/nuEpvJd.png",
			});

		// Buttons
		const buttons = new MessageActionRow().addComponents(
			new MessageButton().setCustomId("yes").setLabel("Yes").setStyle("SUCCESS").setEmoji("👍"),

			new MessageButton().setCustomId("maybe").setLabel("Maybe").setStyle("PRIMARY").setEmoji("🔸"),

			new MessageButton().setCustomId("no").setLabel("No").setStyle("DANGER").setEmoji("👎"),

			new MessageButton().setCustomId("update").setStyle("SECONDARY").setEmoji("🔄")
		);

		const channelName = (interaction.channel as TextChannel).name;
		console.log(`Schedule triggered by ${interaction.user.tag} in #${channelName}.`);
		await interaction.reply({
			content: mentionSubs,
			embeds: [mainEmbed],
			components: [buttons],
		});

		const reply = await interaction.fetchReply() as Message

		let doingUpdate = false;

		const doUpdate = async () => {
			if (doingUpdate)
			{// doing update, try again later
				setTimeout(doUpdate, 1000);
				console.log('Skipping update')
				return;
			}

			let [yesString, noString] = createString(yesEntry, noEntry); //array size
			let mainEmbed = createEmbed(yesString, noString, timeScheduled, yesEntry, noEntry);
			let buttons = createButton();
			const [, , totalMinutes,] = getCountdown(timeScheduled)

			await reply.edit({
				embeds: [mainEmbed],
				components: [buttons],
			});
			if (totalMinutes >= 0) // stop updating when time 
				setTimeout(doUpdate, 60000);
			else
				console.log('Update stopped')
		}
		setTimeout(doUpdate, 60000);

		const totalMinutesNum = totalMinutes as number;
		const interactionTimeout = (30 + totalMinutesNum) * 60 * 1000;
		const collector = reply.createMessageComponentCollector({
			time: interactionTimeout,
		});

		collector.on("collect", async (i) => {
			let user = i.user.username;
			doingUpdate = true;
			const buttonClicked = i.customId;
			console.log(`Schedule Button Clicked:\n   User: ${user}\n   ButtonClicked: ${buttonClicked}`);

			user = assignPriority(user);

			if (buttonClicked === "yes") {
				await i.deferUpdate();

				if (yesEntry.indexOf(user) > -1) {
					yesEntry.splice(yesEntry.indexOf(user), 1);
				}

				if (yesEntry.indexOf(user + " 🔸") > -1) {
					yesEntry.splice(yesEntry.indexOf(user + " 🔸"), 1);
				}

				if (noEntry.indexOf(user) > -1) {
					noEntry.splice(noEntry.indexOf(user), 1);
				}

				yesEntry.push(user);

				let [yesString, noString] = createString(yesEntry, noEntry); //array size
				let mainEmbed = createEmbed(yesString, noString, timeScheduled, yesEntry, noEntry);
				let buttons = createButton();

				await i.editReply({
					embeds: [mainEmbed],
					components: [buttons],
				});
			} else if (buttonClicked === "maybe") {
				await i.deferUpdate();

				if (yesEntry.indexOf(user) > -1) {
					yesEntry.splice(yesEntry.indexOf(user), 1);
				}

				if (yesEntry.indexOf(user + " 🔸") > -1) {
					yesEntry.splice(yesEntry.indexOf(user + " 🔸"), 1);
				}

				if (noEntry.indexOf(user) > -1) {
					noEntry.splice(noEntry.indexOf(user), 1);
				}

				yesEntry.push(user + " 🔸");

				let [yesString, noString] = createString(yesEntry, noEntry);
				let mainEmbed = createEmbed(yesString, noString, timeScheduled, yesEntry, noEntry);
				let buttons = createButton();

				await i.editReply({
					embeds: [mainEmbed],
					components: [buttons],
				});
			} else if (buttonClicked === "no") {
				await i.deferUpdate();

				if (yesEntry.indexOf(user) > -1) {
					yesEntry.splice(yesEntry.indexOf(user), 1);
				}

				if (yesEntry.indexOf(user + " 🔸") > -1) {
					yesEntry.splice(yesEntry.indexOf(user + " 🔸"), 1);
				}

				if (noEntry.indexOf(user) > -1) {
					noEntry.splice(noEntry.indexOf(user), 1);
				}

				noEntry.push(user);

				let [yesString, noString] = createString(yesEntry, noEntry);
				let mainEmbed = createEmbed(yesString, noString, timeScheduled, yesEntry, noEntry);
				let buttons = createButton();

				await i.editReply({
					embeds: [mainEmbed],
					components: [buttons],
				});
			} else if (buttonClicked === "update") {
				await i.deferUpdate();

				let [yesString, noString] = createString(yesEntry, noEntry);
				let mainEmbed = createEmbed(yesString, noString, timeScheduled, yesEntry, noEntry);
				let buttons = createButton();

				await i.editReply({
					embeds: [mainEmbed],
					components: [buttons],
				});
			}

			doingUpdate = false;
		});

		// 30 Minutes after Scheduled time has passed.
		collector.on("end", async (i) => {
			console.log("Ended Schedule Message");

			var buttons = new MessageActionRow().addComponents(
				new MessageButton().setCustomId("yes").setLabel("Yes").setStyle("SUCCESS").setEmoji("👍").setDisabled(true),

				new MessageButton().setCustomId("maybe").setLabel("Maybe").setStyle("PRIMARY").setEmoji("🤷").setDisabled(true),

				new MessageButton().setCustomId("no").setLabel("No").setStyle("DANGER").setEmoji("👎").setDisabled(true)
			);

			await interaction.editReply({
				components: [buttons],
			});
		});
	},
};

const createEmbed = (yesString: string, noString: string, timeScheduled: string, yesEntry: string[], noEntry: string[]) => {
	let [countdownHour, countdownMinute, totalMinutes, epochTime] = getCountdown(timeScheduled);

	if (totalMinutes > 0) {
		var countdownOutput = `Starting in ${countdownHour}H ${countdownMinute}M`;
	} else {
		var countdownOutput = `Started!`;
	}
	const epochTimeAsDate = epochTime as Date;
	const epochTimeStr = String(epochTimeAsDate.getTime()).slice(0, -3);

	var mainEmbed = new MessageEmbed()
		.setColor("0xFF6F00" as ColorResolvable)
		.setTitle("10 Man")
		.setURL("https://10man.commoncrayon.com/")
		.setDescription("Join a 10 Man!")
		.addFields(
			{ name: "Time:", value: `<t:${epochTimeStr}>` },
			{ name: "🔄 Countdown:", value: countdownOutput },
			{
				name: `__Yes(${yesEntry.length}):__`,
				value: yesString,
				inline: true,
			},
			{
				name: `__No(${noEntry.length}):__`,
				value: noString,
				inline: true,
			}
		)
		.setFooter({
			text: "Server IP: connect crayon.csgo.fr:27015; password fun",
			iconURL: "https://i.imgur.com/nuEpvJd.png",
		});
	return mainEmbed;
};

const createButton = () => {
	var buttons = new MessageActionRow().addComponents(
		new MessageButton().setCustomId("yes").setLabel("Yes").setStyle("SUCCESS").setEmoji("👍"),

		new MessageButton().setCustomId("maybe").setLabel("Maybe").setStyle("PRIMARY").setEmoji("🔸"),

		new MessageButton().setCustomId("no").setLabel("No").setStyle("DANGER").setEmoji("👎"),

		new MessageButton().setCustomId("update").setStyle("SECONDARY").setEmoji("🔄")
	);
	return buttons;
};

const createString = (yesEntry: string[], noEntry: string[]) => {
	// For Yes
	let yesString: string;
	let noString: string;
	if (yesEntry.length == 0) {
		yesString = "Empty";
	} else {
		yesString = "";
		for (var l = 0; l < yesEntry.length; l++) {
			if (l == 9) {
				yesString = yesString + yesEntry[l] + "\n🔹 10 Players🔹\n";
			} else {
				yesString = yesString + yesEntry[l] + "\n";
			}
		}
	}

	// For No
	if (noEntry.length == 0) {
		noString = "Empty";
	} else {
		noString = "";
		for (var l = 0; l < noEntry.length; l++) {
			noString = noString + noEntry[l] + "\n";
		}
	}

	return [yesString, noString];
};

const getCountdown = (timeScheduled: string) => {
	const convertMsToHM = (milliseconds: number) => {
		let seconds = Math.floor(milliseconds / 1000);
		let minutes = Math.floor(seconds / 60);
		const totalMinutes = minutes;
		let hours = Math.floor(minutes / 60);
		seconds = seconds % 60;
		minutes = seconds >= 30 ? minutes + 1 : minutes;
		minutes = minutes % 60;
		return [hours, minutes, totalMinutes];
	};

	const scheduledTimeArray = timeScheduled.split(":");

	const localScheduleHour = parseInt(scheduledTimeArray[0], 10);
	const localScheduleMin = parseInt(scheduledTimeArray[1], 10);
	const localScheduledTime = new Date();
	localScheduledTime.setHours(localScheduleHour, localScheduleMin, 0, 0);

	const utcScheduleHour = localScheduledTime.getUTCHours();
	const utcScheduleMin = localScheduledTime.getUTCMinutes();
	const utcScheduledTime = new Date();
	utcScheduledTime.setHours(utcScheduleHour, utcScheduleMin);

	const currDate = new Date();

	const duration = localScheduledTime.getTime() - currDate.getTime();

	const asHM = convertMsToHM(duration);

	return [asHM[0], asHM[1], asHM[2], localScheduledTime];
};

const assignPriority = (user: string) => {
	const priority = [
		"Roald",
		"linkinblak",
		"QueeN",
		"DashBash",
		"Royal Bacon",
		"<@431743926974808076>", // k0vac
		"Amajha",
		"CaJeB3",
		"ShadowPoor",
		"Rik",
		"CommonCrayon",
		"Thisted",
	];

	for (var i = 0; i < priority.length; i++) {
		if (user === priority[i]) {
			user = "🎗️" + user;
		}
	}
	return user;
};
