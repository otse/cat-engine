import glob from "../dep/glob.js";
import pts from "../dep/pts.js";
import game from "../eye/game.js";

import renderer from "./renderer.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";
import game_object from "./objects/game object.js";

// Welcome to the chaos of worldetch! 🌍🔥

export interface object3dliteral extends tileform.shape3d.literal {
	groundPreset?: game.groundPreset,
	shapePreset?: game.shapePreset
}

export namespace object3d {
	export type literal = object3dliteral;
};

export class object3d {
	gobj: game_object
	shape?: tileform.shape3d
	data_: object3d.literal
	constructor(
		readonly data: object3dliteral
	) {
		let groundData = game.groundPresets[data.groundPreset!];
		let shapeData = game.shapePresets[data.shapePreset!];
		this.data = {
			...data,
			...groundData,
			...shapeData
		};
		this.gobj = this.data.gobj;
		this.gobj.object3d = this;
	}
	delete() {
		this.shape?.delete();
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