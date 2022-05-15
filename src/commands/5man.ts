import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInterface } from "../interfaces/CommandInterface";
import {
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	ColorResolvable,
	TextChannel,
} from "discord.js";

export const fiveMan: CommandInterface = {
	data: new SlashCommandBuilder()
		.setName("5man")
		.setDescription("Run a 5 Man Queue!"),

	run: async (interaction) => {
		if (!interaction.channel) return;

		const yesEntry: string[] = [];
		const maybeEntry: string[] = [];
		const noEntry: string[] = [];

		// Embed
		const mainEmbed = new MessageEmbed()
			.setColor("0xFF6F00" as ColorResolvable)
			.setTitle("5 Man")
			.setDescription("Queue for a 5 Man!")
			.addFields(
				{ name: "__Yes:__", value: "Empty", inline: true },
				{ name: "__Maybe:__", value: "Empty", inline: true },
				{ name: "__No:__", value: "Empty", inline: true }
			);

		// Buttons
		const buttons = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId("yes5man")
				.setLabel("Yes")
				.setStyle("SUCCESS")
				.setEmoji("👍"),

			new MessageButton()
				.setCustomId("maybe5man")
				.setLabel("Maybe")
				.setStyle("PRIMARY")
				.setEmoji("🤷"),

			new MessageButton()
				.setCustomId("no5man")
				.setLabel("No")
				.setStyle("DANGER")
				.setEmoji("👎")
		);

		await interaction.reply({
			embeds: [mainEmbed],
			components: [buttons],
		});

		const channelName = (interaction.channel as TextChannel).name;
		console.log(
			`Schedule triggered by ${interaction.user.tag} in #${channelName}.`
		);

		const interactionTimeout = 150 * 60 * 1000; // 150 Minutes * 60 to make into seconds * 1000 to make it into miliseconds

		const collector = interaction.channel.createMessageComponentCollector({
			time: interactionTimeout,
		});

		collector.on("collect", async (i) => {
			let user = i.user.username;
			const buttonClicked = i.customId;
			console.log(
				`Schedule Button Clicked:\n   User: ${user}\n   ButtonClicked: ${buttonClicked}`
			);

			if (buttonClicked === "yes") {
				await i.deferUpdate();

				if (yesEntry.indexOf(user) > -1) {
					yesEntry.splice(yesEntry.indexOf(user), 1);
				}

				if (maybeEntry.indexOf(user) > -1) {
					maybeEntry.splice(maybeEntry.indexOf(user), 1);
				}

				if (noEntry.indexOf(user) > -1) {
					noEntry.splice(noEntry.indexOf(user), 1);
				}

				yesEntry.push(user);

				let [yesString, maybeString, noString] = createString(
					yesEntry,
					maybeEntry,
					noEntry
				); //array size
				let mainEmbed = createEmbed(
					yesString,
					maybeString,
					noString,
					yesEntry,
					maybeEntry,
					noEntry
				);
				let buttons = createButton();

				await i.deleteReply();
				await i.followUp({
					embeds: [mainEmbed],
					components: [buttons],
				});
			} else if (buttonClicked === "maybe") {
				await i.deferUpdate();

				if (yesEntry.indexOf(user) > -1) {
					yesEntry.splice(yesEntry.indexOf(user), 1);
				}

				if (maybeEntry.indexOf(user) > -1) {
					maybeEntry.splice(maybeEntry.indexOf(user), 1);
				}

				if (noEntry.indexOf(user) > -1) {
					noEntry.splice(noEntry.indexOf(user), 1);
				}

				maybeEntry.push(user);

				let [yesString, maybeString, noString] = createString(
					yesEntry,
					maybeEntry,
					noEntry
				);
				let mainEmbed = createEmbed(
					yesString,
					maybeString,
					noString,
					yesEntry,
					maybeEntry,
					noEntry
				);
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

				if (maybeEntry.indexOf(user) > -1) {
					maybeEntry.splice(maybeEntry.indexOf(user), 1);
				}

				if (noEntry.indexOf(user) > -1) {
					noEntry.splice(noEntry.indexOf(user), 1);
				}

				noEntry.push(user);

				let [yesString, maybeString, noString] = createString(
					yesEntry,
					maybeEntry,
					noEntry
				);
				let mainEmbed = createEmbed(
					yesString,
					maybeString,
					noString,
					yesEntry,
					maybeEntry,
					noEntry
				);
				let buttons = createButton();

				await i.editReply({
					embeds: [mainEmbed],
					components: [buttons],
				});
			}
		});

		// 30 Minutes after Scheduled time has passed.
		collector.on("end", async (i) => {
			console.log("Ended 5Man Message");

			var buttons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId("yes5man")
					.setLabel("Yes")
					.setStyle("SUCCESS")
					.setEmoji("👍")
					.setDisabled(true),

				new MessageButton()
					.setCustomId("maybe5man")
					.setLabel("Maybe")
					.setStyle("PRIMARY")
					.setEmoji("🤷")
					.setDisabled(true),

				new MessageButton()
					.setCustomId("no5man")
					.setLabel("No")
					.setStyle("DANGER")
					.setEmoji("👎")
					.setDisabled(true)
			);

			await interaction.editReply({
				components: [buttons],
			});
		});
	},
};

const createEmbed = (
	yesString: string,
	maybeString: string,
	noString: string,
	yesEntry: string[],
	maybeEntry: string[],
	noEntry: string[]
) => {
	const mainEmbed = new MessageEmbed()
		.setColor("0xFF6F00" as ColorResolvable)
		.setTitle("5 Man")
		.setDescription("Queue for a 5 Man!")
		.addFields(
			{
				name: `__Yes(${yesEntry.length}):__`,
				value: yesString,
				inline: true,
			},
			{
				name: `__Maybe(${maybeEntry.length}):__`,
				value: maybeString,
				inline: true,
			},
			{
				name: `__No(${noEntry.length}):__`,
				value: noString,
				inline: true,
			}
		);
	return mainEmbed;
};

const createButton = () => {
	const buttons = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId("yes5man")
			.setLabel("Yes")
			.setStyle("SUCCESS")
			.setEmoji("👍"),

		new MessageButton()
			.setCustomId("maybe5man")
			.setLabel("Maybe")
			.setStyle("PRIMARY")
			.setEmoji("🤷"),

		new MessageButton()
			.setCustomId("no5man")
			.setLabel("No")
			.setStyle("DANGER")
			.setEmoji("👎")
	);
	return buttons;
};

const createString = (
	yesEntry: string[],
	maybeEntry: string[],
	noEntry: string[]
) => {
	// For Yes
	let yesString: string;
	let noString: string;
	let maybeString: string;
	if (yesEntry.length == 0) {
		yesString = "Empty";
	} else {
		yesString = "";
		for (var l = 0; l < yesEntry.length; l++) {
			yesString = yesString + yesEntry[l] + "\n";
		}
	}

	// For Maybe
	if (maybeEntry.length == 0) {
		maybeString = "Empty";
	} else {
		maybeString = "";
		for (var l = 0; l < maybeEntry.length; l++) {
			maybeString = maybeString + maybeEntry[l] + "\n";
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

	return [yesString, maybeString, noString];
};
