import lod from "../lod.js";
import gobj from "./gobj.js";
import sprite from "../sprite.js";
import tile from "./tile.js";

// An exaxmple of what happens when you
// superclass the superclass of a gobj

export class bettertile extends tile {
	constructor(data: gobj_literal) {
		super({
			name: 'a better tile',
			...data,
		 	// _type: 'bettertile'
			// Will get overwritten by superclass
		});
		this.data._type = 'bettertile';
		console.log('bettertile', this.data);
	}
	fuck() {
	}
}

export default bettertile;