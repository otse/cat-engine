import clod from "../clod.js";
import game_object from "./game object.js";
import sprite from "../sprite.js";
import glob from "../../dep/glob.js";
import pts from "../../dep/pts.js";

// Legacy just use tile 3d

export class tile extends game_object {
	constructor(data: game_object_literal) {
		super({
			name: 'a tile',
			...data
		});
		this.wpos = pts.floor(this.wpos);
		this.data._type = 'tile';
	}
	protected override _create() {
		new sprite({
			gobj: this,
			spriteSize: pts.hexSize
		});
		this.sprite?.create();
	}
	/*protected override _delete() {
		console.log('delete');
	}*/
}

export default tile;