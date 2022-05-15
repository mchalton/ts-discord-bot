import { CommandInterface } from "src/interfaces/CommandInterface";
import { SlashCommandBuilder } from "@discordjs/builders";
import { ColorResolvable, MessageEmbed } from "discord.js";
import Rcon from "ts-rcon";
import { getUserData } from "../modules/users";

export const start: CommandInterface = {
	data: new SlashCommandBuilder()
		.setName("start")
		.setDescription("Start a 10 Man Game"),

	run: async (interaction) => {
		const user = await getUserData(interaction.user.id);

		if (user?.isAdmin) {
			const fs = require("fs");

			const serverIP = fs.readFileSync(
				"commands/serverinfo/serverinfo.txt",
				"utf8"
			);
			const serverPW = fs.readFileSync(
				"commands/serverinfo/serverpw.txt",
				"utf8"
			);

			const conn = new Rcon(serverIP, 27015, serverPW);

			conn.on("auth", function () {
				console.log("Authenticated");
				console.log("Sending command: mp_warmup_end");

				conn.send("mp_warmup_end");
			})
				.on("response", function (str) {
					console.log("Response: " + str);
				})
				.on("error", function (err) {
					console.log("Error: " + err);
				})
				.on("end", function () {
					console.log("Connection closed");
				});

			conn.connect();

			// Embed
			var startEmbed = new MessageEmbed()
				.setColor("0xFF6F00" as ColorResolvable)
				.setTitle("Warmup Ended");

			await interaction.reply({ embeds: [startEmbed] });
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
