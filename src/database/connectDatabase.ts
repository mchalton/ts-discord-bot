import { connect, pluralize } from "mongoose";
import { errorHandler } from "../utils/errorHandler";

export const connectDatabase = async (): Promise<void> => {
	try {
		await connect(process.env.MONGO_URI as string);
		pluralize(null);

		console.log("Database connection successful.");
	} catch (error) {
		errorHandler("database connection", error);
	}
};
