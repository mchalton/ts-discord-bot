import { SlashCommandBuilder } from "@discordjs/builders";
import { ColorResolvable, MessageEmbed } from "discord.js";
import { CommandInterface } from "src/interfaces/CommandInterface";
import { subscribeUser } from "../modules/users";

export const subscribe: CommandInterface = {
	data: new SlashCommandBuilder().setName("subscribe").setDescription("Subscribe to get notified by the Scheduler!"),

	run: async (interaction) => {
		await subscribeUser(interaction.user.id);

		// Embed
		var subEmbed = new MessageEmbed()
			.setColor("0xFF6F00" as ColorResolvable)
			.setTitle("Subscribed to 10 Man Notificaiton")
			.setTimestamp();

		await interaction.reply({ embeds: [subEmbed], ephemeral: true });
	},
};
