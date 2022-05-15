import { SlashCommandBuilder } from "@discordjs/builders";
import {
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	ColorResolvable,
	TextChannel,
} from "discord.js";
import { CommandInterface } from "src/interfaces/CommandInterface";
import { getUserData } from "../modules/users";
import { addMap as addMapToDB } from "../modules/maps";

export const addMap: CommandInterface = {
	data: new SlashCommandBuilder()
		.setName("addmap")
		.setDescription("Adds a Map to the Pool")
		.addStringOption((option) =>
			option
				.setName("workshopid")
				.setDescription("Enter the Workshop ID")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("mapname")
				.setDescription("Enter the Name of Map")
				.setRequired(true)
		) as SlashCommandBuilder,

	run: async (interaction) => {
		const workshopid = interaction.options.getString("workshopid")!;
		const mapname = interaction.options.getString("mapname")!;

		const user = await getUserData(interaction.user.id);

		if (user?.isAdmin) {
			addMapToDB(workshopid, mapname);

			// Embed
			var addEmbed = new MessageEmbed()
				.setColor("0xFF6F00" as ColorResolvable)
				.setTitle("Successfully Added Map: " + workshopid)
				.setTimestamp();

			await interaction.reply({ embeds: [addEmbed] });
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
