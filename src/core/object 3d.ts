import glob from "../dep/glob.js";
import pts from "../dep/pts.js";
import game from "../eye/game.js";

import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";
import game_object from "./objects/game object.js";

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
		let groundData = game.groundPresets[
			data.gobj.object3dmerge_?.groundPreset ?? data.groundPreset!];
		let shapeData = game.shapePresets[
			data.gobj.object3dmerge_?.shapePreset ?? data.shapePreset!];
		this.data = {
			...data,
			...groundData,
			...shapeData,
			...data.gobj.object3dmerge_
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