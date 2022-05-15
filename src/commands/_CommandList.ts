import { CommandInterface } from "../interfaces/CommandInterface";
import { schedule } from "./schedule";
import { fiveMan } from "./5man";
import { addMap } from "./addmap";
import { help } from "./help";
import { map } from "./map";
import { pool } from "./pool";
import { rcon } from "./rcon";
import { removeMap } from "./removemap";
import { spinmap } from "./spinmap";
import { start } from "./start";
import { subscribe } from "./subscribe";
import { unsubscribe } from "./unsubscribe";
import { votemap } from "./votemap";

export const CommandList: CommandInterface[] = [
	schedule,
	fiveMan,
	addMap,
	help,
	map,
	pool,
	rcon,
	removeMap,
	spinmap,
	start,
	subscribe,
	unsubscribe,
	votemap,
];
