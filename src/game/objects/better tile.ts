import lod from "../lod.js";
import gobj from "./gobj.js";
import sprite from "../sprite.js";
import tile from "./tile.js";

// Example second subclass of a gobj

export class bettertile extends tile {
	constructor(data: gobj_literal) {
		super({
			name: 'a better tile',
			...data
		});
		this.data._type = 'bettertile';
		console.log('bettertile', this.data);
	}
	fuck() {
	}
}

export default bettertile;