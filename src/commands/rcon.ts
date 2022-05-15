import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInterface } from "src/interfaces/CommandInterface";
import { getUserData } from "../modules/users";
import { ColorResolvable, MessageEmbed } from "discord.js";
import Rcon from "ts-rcon";

export const rcon: CommandInterface = {
	data: new SlashCommandBuilder()
		.setName("rcon")
		.setDescription("Send a command to the Server")
		.addStringOption((option) => option.setName("command").setDescription("Enter a Rcon Command").setRequired(true)) as SlashCommandBuilder,

	run: async (interaction) => {
		const user = await getUserData(interaction.user.id);

		if (user?.isAdmin) {
			const command = interaction.options.getString("command")!;

			const fs = require("fs");

			const serverIP = fs.readFileSync("commands/serverinfo/serverinfo.txt", "utf8");
			const serverPW = fs.readFileSync("commands/serverinfo/serverpw.txt", "utf8");

			var conn = new Rcon(serverIP, 27015, serverPW);

			conn.on("auth", function () {
				console.log("Authenticated");
				console.log("Sending command: " + command);

				conn.send(command);
			})
				.on("response", function (str) {
					console.log("Response: " + str); // HOW TO GET STR RESPONSE
				})
				.on("error", function (err) {
					console.log("Error: " + err);
				})
				.on("end", function () {
					console.log("Connection closed");
				});

			conn.connect();

			// Embed
			var rconEmbed = new MessageEmbed()
				.setColor("0xFF6F00" as ColorResolvable)
				.setTitle("Successfully sent command: " + command)
				.setDescription("RESPONSE WILL BE ADDED");

			await interaction.reply({ embeds: [rconEmbed] });
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
