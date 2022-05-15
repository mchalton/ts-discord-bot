import { CommandInterface } from "src/interfaces/CommandInterface";
import { getMaps } from "../modules/maps";

import { SlashCommandBuilder } from "@discordjs/builders";
import { ColorResolvable, MessageEmbed } from "discord.js";

export const pool: CommandInterface = {
	data: new SlashCommandBuilder().setName("pool").setDescription("Displays the Map Pool"),

	run: async (interaction) => {
		const mapList = await getMaps();

		var mapStr = "";
		for (const item of mapList) {
			mapStr += item.name + ", ";
		}

		// Embed
		var poolEmbed = new MessageEmbed()
			.setColor("0xFF6F00" as ColorResolvable)
			.setTitle("10 Man Map Pool")
			.setURL("https://10man.commoncrayon.com/")
			.setDescription("Map Pool of " + mapList.length + " maps!")
			.addFields({ name: "Map:", value: mapStr })
			.setTimestamp();

		await interaction.reply({ embeds: [poolEmbed] });
	},
};
