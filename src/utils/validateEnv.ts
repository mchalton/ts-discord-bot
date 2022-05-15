export const validateEnv = (): void => {
	if (!process.env.BOT_TOKEN) {
		console.error("Missing Discord bot token.");
		process.exit(1);
	}

	if (!process.env.MONGO_URI) {
		console.error("Missing MongoDB connection.");
		process.exit(1);
	}
};
