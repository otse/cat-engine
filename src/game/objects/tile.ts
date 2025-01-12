import lod from "../lod.js";
import bobj from "./bobj.js";
import sprite from "../sprite.js";

export class tile extends bobj {
	constructor(data: bobj_literal) {
		super({
			name: 'a tile',
			...data,
			_type: 'tile',
		});
		new sprite({ bound: this, size: [12, 8] });

	}
}

export default tile;