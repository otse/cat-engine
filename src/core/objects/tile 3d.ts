import glob from "../../dep/glob.js";

import game_object from "./game object.js";
import sprite3d from "../sprite 3d.js";
import game from "../../eye/game.js";

export class tile3d extends game_object {
	constructor(data: game_object_literal, readonly preset: game.groundPreset = 'default') {
		super({
			name: 'a tile 3d',
			...data
		});
		this.sprite3dliteral = {
			sprite3dGroundPreset: preset
		} as sprite3d.literaltype;
		this.data._type = 'tile 3d';
	}
	protected override _create() {
		new sprite3d({
			gobj: this,
			spriteSize: glob.hexSize,
			sprite3dGroundPreset: this.preset,
			shapeSize: [1, 1, 1],
			shapeType: 'hex',
			...this.sprite3dliteral,
		});
		this.sprite?.create();
	}
}



export default tile3d;