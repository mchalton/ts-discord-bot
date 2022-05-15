import { SlashCommandBuilder } from "@discordjs/builders";
import { ColorResolvable, MessageEmbed } from "discord.js";
import { CommandInterface } from "src/interfaces/CommandInterface";
import { getMaps } from "../modules/maps";
import { getUserData } from "../modules/users";

export const spinmap: CommandInterface = {
	data: new SlashCommandBuilder()
		.setName("spinmap")
		.setDescription("Gets One Random Map"),

	run: async (interaction) => {
		const user = await getUserData(interaction.user.id);
		if (user?.isAdmin) {
			const mapList = await getMaps();

			const random = Math.floor(Math.random() * mapList.length);
			const map = mapList[random];

			const mapID = map.id;
			const mapName = map.name;

			// Embed
			var poolEmbed = new MessageEmbed()
				.setColor("0xFF6F00" as ColorResolvable)
				.setTitle("Retrieved Map: " + mapName)
				.setURL(
					"https://steamcommunity.com/sharedfiles/filedetails/?id=".concat(
						mapID
					)
				)
				.setDescription("Workshop ID: " + mapID)
				.setTimestamp();

			await interaction.reply({ embeds: [poolEmbed] });
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
	},
};
