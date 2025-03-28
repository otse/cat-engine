
import glob from "./../../dep/glob.js";
import game_object from "./game object.js";
import object3d from "../object 3d.js";
import direction_adapter from "../direction adapter.js";
import game from "../../eye/game.js";

export class wall3d extends game_object {
	wallAdapter: direction_adapter
	constructor(data: game_object_literal, readonly preset: game.shapePreset = 'default') {
		super({
			name: 'a wall 3d',
			...data,
		});
		this.data._type = 'wall 3d';
		this.object3dmerge.shapePreset = preset;
		this.wallAdapter = new direction_adapter(this);
	}
	protected override _create() {
		new object3d({
			gobj: this,
			shapeSize: [16, 8, 11],
			shapeType: 'wall'
		});
		this.wallAdapter.search(['wall 3d']);
		this.object3d?.create();
	}
}

export default wall3d;