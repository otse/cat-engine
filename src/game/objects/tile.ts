import lod from "../lod.js";
import baseobject from "./base object.js";
import sprite from "../sprite.js";

export class tile extends baseobject {
	constructor(data: baseobjectliteral) {
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
		this.sprite?.create();
	}
	protected override _delete() {
		console.log('hiiide');
		
	}
}

export default tile;