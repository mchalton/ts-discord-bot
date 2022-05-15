import { errorHandler } from "../utils/errorHandler";
import MapModel, { MapInterface } from "../database/models/MapModel";

export const addMap = async (map_id: string, map_name: string) => {
	try {
		await MapModel.create({ id: map_id, name: map_name });
		return true;
	} catch (error) {
		errorHandler("addMap module", error);
		return false;
	}
};

export const getMaps = async (): Promise<MapInterface[]> => {
	try {
		const mapList = await MapModel.find().sort("name");
		return mapList;
	} catch (error) {
		errorHandler("getMaps module", error);
		return [];
	}
};

export const deleteMap = async (map_id: string) => {
	try {
		await MapModel.deleteOne({ id: map_id });
	} catch (error) {
		errorHandler("deleteMap module", error);
		return false;
	}
};
