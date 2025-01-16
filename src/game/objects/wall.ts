import lod from "../lod.js";
import gobj from "./gobj.js";
import sprite from "../sprite.js";

export class wall extends gobj {
	constructor(data: gobj_literal) {
		super({
			name: 'a wall',
			...data,
		});
		this.data._type = 'wall';
		console.log('wall', this.data);
		this._create();
	}
	protected override _create() {
		new sprite({
			gobj: this,
			size: [17, 21],
			name: 'hex/wall.png'
		});
	}
}

export default wall;