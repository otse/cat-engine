import glob from "../../dep/glob.js";

import game_object from "./game object.js";
import sprite3d from "../sprite 3d.js";
import pts from "../../dep/pts.js";

export class tile3d extends game_object {
	preset
	constructor(data: game_object_literal, preset = 'default') {
		super({
			name: 'a tile 3d',
			...data
		});
		this.preset = presets[preset] || presets['default'];
		this.data._type = 'tile 3d';
	}
	protected override _create() {
		new sprite3d({
			...this.preset,
			gobj: this,
			spriteSize: pts.hexSize,
			shapeSize: [1, 1, 1],
			shapeType: 'hex',
		});
		this.sprite?.create();
	}
	/*protected override _delete() {
		console.log('delete');
	}*/
}

const presets: { [index: string]: sprite3d.literaltype } = {
	default: {
		gobj: {} as any,
		shapeGroundTexture: './img/textures/beach.jpg',
	},
	overgrown: {
		gobj: {} as any,
		shapeGroundTexture: './img/textures/overgrown.jpg',
	},
	cobblestone: {
		gobj: {} as any,
		shapeGroundTexture: './img/textures/cobblestone2.jpg',
	}
}

export default tile3d;