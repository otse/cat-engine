import lod from "../lod.js";
import game_object from "./game object.js";
import sprite from "../sprite.js";

export class wall extends game_object {
	constructor(data: game_object_literal) {
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
			gabeObject: this,
			size: [17, 21],
			name: 'hex/wall.png',
			color: 'blue'
		});
		this.sprite?.create();
	}
}

export default wall;