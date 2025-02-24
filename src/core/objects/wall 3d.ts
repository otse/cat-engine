
import game_object from "./game object.js";
import sprite3d from "../sprite 3d.js";
import glob from "../../dep/glob.js";
import direction_adapter from "../direction adapter.js";

export class wall3d extends game_object {
	directionAdapter: direction_adapter

	constructor(data: game_object_literal) {
		super({
			name: 'a wall 3d',
			...data,
		});
		this.data._type = 'wall 3d';
		this.directionAdapter = new direction_adapter(this);
		// This code runs after _create
		// because the super adds this object to the clod
	}
	protected override _create() {
		new sprite3d({
			gobj: this,
			spriteSize: [glob.hexSize[0] * 2, glob.hexSize[1] * 4],
			// spriteColor: 'magenta',
			shapeSize: [16, 16, 10],
			shapeType: 'wall',
			groundPreset: 'stonemixed',
			...this.sprite3dliteral,
		});
		this.directionAdapter.search(['wall 3d']);
		this.sprite?.create();
	}
	/*protected override _delete() {
		console.log('delete');
	}*/
	//protected override _step() {
	//	super._step();
	//	this.sprite?.step();
	//}
}

export default wall3d;