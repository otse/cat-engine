
import game_object from "./game object.js";
import sprite3d from "../sprite 3d.js";
import glob from "./../../dep/glob.js";
import direction_adapter from "../direction adapter.js";

export class wall3d extends game_object {
	wallAdapter: direction_adapter
	constructor(data: game_object_literal) {
		super({
			name: 'a wall 3d',
			...data,
		});
		this.data._type = 'wall 3d';
		this.sprite3dliteral.groundPreset = 'water';
		this.wallAdapter = new direction_adapter(this);
	}
	protected override _create() {
		new sprite3d({
			gobj: this,
			spriteSize: [glob.hexSize[0] * 2, glob.hexSize[0] * 3],
			shapeSize: [16, 8, 14],
			shapeType: 'wall'
		});
		this.wallAdapter.search(['wall 3d']);
		this.sprite?.create();
	}
}

export default wall3d;