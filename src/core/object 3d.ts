import glob from "../dep/glob.js";
import pts from "../dep/pts.js";
import game from "../eye/game.js";

import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";
import game_object from "./objects/game object.js";

export interface object3dliteral extends tileform.shape3d.literal {
	groundPreset?: game.groundPreset
}

export namespace object3d {
	export type literal = object3dliteral;
};

export class object3d {
	gobj: game_object
	reprerender
	target
	shape?: tileform.shape3d
	data_: object3d.literal
	constructor(
		readonly data: object3dliteral
	) {
		let groundData = game.groundPresets[
			data.gobj.object3dliteral?.groundPreset || data.groundPreset!];
		this.data = {
			...data,
			...groundData,
			...data.gobj.object3dliteral
		}
		this.reprerender = true;
		this.gobj = this.data.gobj;
		this.gobj.object3d = this;
	}
	delete() {
		this.shape?.delete();
		this.target?.dispose();
	}
	create() {
		this.shape = tileform.shapeMaker(
			this.data.shapeType!,
			this.data);
		this.shape?.create();
	}
	step() {
		this.shape?.step();
	}
}

// this data should be owned by the game
// and maybe attached to glob. or us a hooks?


export default object3d;