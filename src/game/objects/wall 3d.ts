import lod from "../lod.js";
import baseobject from "./base object.js";
import sprite from "../sprite.js";
import tileform from "../tileform.js";

export class wall3d extends baseobject {
	constructor(data: baseobjectliteral) {
		super({
			name: 'a wall 3d',
			...data,
		});
		this.data._type = 'wall 3d';
		console.log('wall', this.data);
		this._create();
	}
	protected override _create() {
		new tileform.modelsprite({
			gobj: this,
			size: [17, 21],
			name: 'hex/wall.png'
		});
	}
}

export default wall3d;