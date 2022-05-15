import { SlashCommandBuilder } from "@discordjs/builders";
import { ColorResolvable, MessageEmbed } from "discord.js";
import { CommandInterface } from "src/interfaces/CommandInterface";
import { unsubscribeUser } from "../modules/users";

export const unsubscribe: CommandInterface = {
	data: new SlashCommandBuilder()
		.setName("unsubscribe")
		.setDescription("Unsubscribe to not get notified by the Scheduler!"),

	run: async (interaction) => {
		await unsubscribeUser(interaction.user.id);

		// Embed
		var subEmbed = new MessageEmbed()
			.setColor("0xFF6F00" as ColorResolvable)
			.setTitle("Unsubscribed to 10 Man Notificaiton")
			.setTimestamp();

		await interaction.reply({ embeds: [subEmbed], ephemeral: true });
	},
};
