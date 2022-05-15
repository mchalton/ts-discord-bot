import { CommandInterface } from "src/interfaces/CommandInterface";
import { SlashCommandBuilder } from "@discordjs/builders";
import { ColorResolvable, MessageEmbed } from "discord.js";
import Rcon from "ts-rcon";
import { getUserData } from "../modules/users";

export const map: CommandInterface = {
	data: new SlashCommandBuilder()
		.setName("map")
		.setDescription("Change map on the server")
		.addStringOption((option) => option.setName("workshopid").setDescription("Enter a Workshop ID").setRequired(true)) as SlashCommandBuilder,

	run: async (interaction) => {
		const user = await getUserData(interaction.user.id);
		if (user?.isAdmin) {
			const fs = require("fs");

			const workshopid = interaction.options.getString("workshopid")!;

			const serverIP = fs.readFileSync("commands/serverinfo/serverinfo.txt", "utf8");
			const serverPW = fs.readFileSync("commands/serverinfo/serverpw.txt", "utf8");

			var conn = new Rcon(serverIP, 27015, serverPW);

			conn.on("auth", () => {
				conn.send("host_workshop_map ".concat(workshopid));
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
			var mapEmbed = new MessageEmbed()
				.setColor("0xFF6F00" as ColorResolvable)
				.setTitle("Successfully Changed Map to: " + workshopid)
				.setURL("https://steamcommunity.com/sharedfiles/filedetails/?id=".concat(workshopid));

			await interaction.reply({ embeds: [mapEmbed] });
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
