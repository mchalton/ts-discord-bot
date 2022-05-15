import { SlashCommandBuilder } from "@discordjs/builders";
import { ColorResolvable, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { MapInterface } from "src/database/models/MapModel";
import { CommandInterface } from "src/interfaces/CommandInterface";
import { getMaps } from "../modules/maps";
import { getUserData } from "../modules/users";

export const votemap: CommandInterface = {
	data: new SlashCommandBuilder()
		.setName("votemap")
		.setDescription("Vote on 5 Random Maps")
		.addNumberOption((option) => option.setName("count").setDescription("Number of maps").setRequired(true)) as SlashCommandBuilder,

	run: async (interaction) => {
		if (!interaction.channel) return;

		const user = await getUserData(interaction.user.id);

		let optionList: string[] = [];
		let mapList: MapInterface[] = [];
		if (user?.isAdmin) {
			const mapListRaw = await getMaps();
			const mapCount = interaction.options.getNumber("count")!;

			for (let i = 0; i < mapCount; i++) {
				const random = Math.floor(Math.random() * mapListRaw.length);
				const map = mapListRaw[random];
				mapList.push(map);
				mapListRaw.splice(random, 1);
			}

			// Embed
			const poolEmbed = new MessageEmbed()
				.setColor("0xFF6F00" as ColorResolvable)
				.setTitle("Vote on Map to Play!")
				.setTimestamp();

			for (let i = 0; i < mapCount; i++) {
				poolEmbed.addField(
					mapList[i].name,
					"[Link](https://steamcommunity.com/sharedfiles/filedetails/?id=".concat(mapList[i].id) + ")\n\u200b"
				);
			}
			const menu = new MessageSelectMenu().setCustomId("select").setPlaceholder("Nothing selected");

			for (let i = 0; i < mapCount; i++) {
				const optionName = "option" + i.toString();
				optionList.push(optionName);
				menu.addOptions({
					label: String(mapList[i].name),
					value: optionName,
				});
			}

			const dropdown = new MessageActionRow().addComponents(menu);

			await interaction.reply({
				embeds: [poolEmbed],
				components: [dropdown],
			});
		} else {
			// Missing Perms
			var deniedEmbed = new MessageEmbed()
				.setColor("0xFF6F00" as ColorResolvable)
				.setTitle("Permission Denied")
				.setDescription("Must be an Admin");

			await interaction.reply({
				embeds: [deniedEmbed],
				ephemeral: true,
			});
		}

		let options: string[][] = [];
		for (let i = 0; i < optionList.length; ++i) {
			options.push([]); // push empty user lists
		}

		let interactionTimeout = 12 * 60 * 60 * 1000; // 12 hours into milliseconds

		const collector = interaction.channel.createMessageComponentCollector({
			time: interactionTimeout,
		});

		collector.on("collect", async (interactEvent: SelectMenuInteraction) => {
			var optionSelected = interactEvent;
			var user = `<@${interactEvent.user.id}>`;

			console.log(`${user} selected ${optionSelected}`);

			for (let i = 0; i < optionList.length; ++i) {
				if (interactEvent.values[0] == optionList[i]) {
					await interactEvent.deferUpdate();

					if (options[i].indexOf(user) > -1) {
						options[i].splice(options[i].indexOf(user), 1);
					} else {
						options[i].push(user);
					}

					const optionsString = createString(options);
					const poolEmbed = createEmbed(mapList, optionsString);

					await interactEvent.editReply({ embeds: [poolEmbed] });
				}
			}
		});

		collector.on("end", async (i) => {
			console.log("Ended Vote");
		});
	},
};

const createEmbed = (mapList: MapInterface[], optionsString: string[]) => {
	const poolEmbed = new MessageEmbed()
		.setColor("0xFF6F00" as ColorResolvable)
		.setTitle("Vote on a Map to Play!")
		.setTimestamp();

	for (let i = 0; i < optionsString.length; ++i) {
		let value = "[Link](https://steamcommunity.com/sharedfiles/filedetails/?id=".concat(mapList[i].id) + ")\n " + optionsString[i];
		if (optionsString[i] != "\u200b") value += "\n\u200b";
		poolEmbed.addField(mapList[i].name, value);
	}

	return poolEmbed;
};

const createString = (options: string[][]) => {
	let optionsString: string[] = [];

	for (let i = 0; i < options.length; i++) {
		if (options[i].length == 0) {
			optionsString[i] = "\u200b";
		} else {
			optionsString[i] = "";
			for (let j = 0; j < options[i].length; ++j) {
				optionsString[i] = optionsString[i] + options[i][j] + " ";
			}
		}
	}

	return optionsString;
};
