import glob from "./../../dep/glob.js";

import game_object from "./game object.js";
import object3d from "../object 3d.js";
import game from "../../eye/game.js";

// Welcome to the chaos of worldetch! 🌍🔥

export class tile3d extends game_object {
	constructor(data: game_object_literal, public preset: game.groundPreset = 'default') {
		super({
			name: 'a tile 3d',
			...data
		});
		this.data._type = 'tile 3d';
	}
	protected override _create() {
		new object3d({
			gobj: this,
			shapeSize: [1, 1, 1],
			shapeType: 'hex',
			groundPreset: this.preset
		});
		this.object3d?.create();
	}
}



export default tile3d;