import clod from "../clod.js";
import game_object from "./game object.js";
import sprite from "../sprite.js";
import glob from "../../dep/glob.js";

// Legacy just use wall 3d

export class wall extends game_object {
	constructor(data: game_object_literal) {
		super({
			name: 'a wall',
			...data,
		});
		this.data._type = 'wall';
	}
	protected override _create() {
		new sprite({
			gabeObject: this,
			size: [17, 21],
			name: 'hex/wall.png',
			color: 'blue'
		});
		this.sprite?.create();
	}
	/*protected override _delete() {
		console.log('delete');
	}*/
}

export default wall;