
import game_object from "./game object.js";
import sprite3d from "../sprite 3d.js";
import glob from "../../dep/glob.js";
import direction_adapter from "../direction adapter.js";

export class wall3d extends game_object {
	directionAdapter: direction_adapter
	sprite3dliteral?: sprite3d.literaltype
	// sprite3dLiteral?: sprite3d // why declare

	constructor(data: game_object_literal) {
		super({
			name: 'a wall 3d',
			...data,
		});
		this.data._type = 'wall 3d';
		// This code runs after _create
		// because the super adds this object to the clod
	}
	protected override _create() {
		this.directionAdapter = new direction_adapter(this);
		// Had to move the DA to the creator, because the super constructor
		// would add the object to the CLOD who would call CREATE
		// before we instantiated our adapter
		new sprite3d({
			gobj: this,
			spriteSize: [glob.hexSize[0] * 2, glob.hexSize[1] * 4],
			// spriteColor: 'magenta',
			shapeSize: [16, 16, 10],
			shapeType: 'wall',
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