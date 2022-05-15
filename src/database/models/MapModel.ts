import { Document, model, Schema } from "mongoose";

export interface MapInterface extends Document {
	id: string;
	name: string;
}

export const MapModel = new Schema(
	{
		id: String,
		name: String,
	},
	{ collection: "10manpool" }
);

export default model<MapInterface>("10manpool", MapModel);
