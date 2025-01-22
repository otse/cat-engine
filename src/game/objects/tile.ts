import clod from "../clod.js";
import game_object from "./game object.js";
import sprite from "../sprite.js";
import glob from "../../dep/glob.js";

// Legacy just use tile 3d

export class tile extends game_object {
	constructor(data: game_object_literal) {
		super({
			name: 'a tile',
			...data
		});
		this.data._type = 'tile';
	}
	protected override _create() {
		new sprite({
			gabeObject: this,
			size: [17, 9]
		});
		this.sprite?.create();
	}
	/*protected override _delete() {
		console.log('delete');
	}*/
}

export default tile;