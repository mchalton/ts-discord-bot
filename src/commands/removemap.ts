import { SlashCommandBuilder } from "@discordjs/builders";
import { ColorResolvable, MessageEmbed } from "discord.js";
import { CommandInterface } from "src/interfaces/CommandInterface";
import { deleteMap } from "../modules/maps";
import { getUserData } from "../modules/users";

export const removeMap: CommandInterface = {
	data: new SlashCommandBuilder()
		.setName("removemap")
		.setDescription("Removes a Map from the Pool")
		.addStringOption((option) =>
			option
				.setName("workshopid")
				.setDescription("Enter a Workshop ID")
				.setRequired(true)
		) as SlashCommandBuilder,

	run: async (interaction) => {
		const workshopid = interaction.options.getString("workshopid")!;

		const user = await getUserData(interaction.user.id);

		if (user?.isAdmin) {
			await deleteMap(workshopid);
			// Embed
			var removeEmbed = new MessageEmbed()
				.setColor("0xFF6F00" as ColorResolvable)
				.setTitle("Successfully Removed Map: " + workshopid)
				.setTimestamp();

			await interaction.reply({ embeds: [removeEmbed] });
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
