import lod from "../lod.js";
import game_object from "./game object.js";
import sprite from "../sprite.js";

export class tile extends game_object {
	constructor(data: game_object_literal) {
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
			gabeObject: this,
			size: [17, 9]
		});
		this.sprite?.create();
	}
	protected override _delete() {
		console.log('hiiide');
		
	}
}

export default tile;