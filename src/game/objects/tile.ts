import lod from "../lod.js";
import gobj from "./gobj.js";
import sprite from "../sprite.js";

export class tile extends gobj {
	constructor(data: gobj_literal) {
		super({
			name: 'a tile',
			...data
		});
		this.data._type = 'tile';
		console.log('tile', this.data);
		this._create();
	}
	protected override _create() {
		new sprite({
			gobj: this,
			size: [17, 9]
		});
	}
}

export default tile;