
import game_object from "./game object.js";
import sprite3d from "../sprite 3d.js";
import glob from "../../dep/glob.js";

export class wall3d extends game_object {
	constructor(data: game_object_literal) {
		super({
			name: 'a wall 3d',
			...data,
		});
		this.data._type = 'wall 3d';
	}
	protected override _create() {
		new sprite3d({
			gabeObject: this,
			size: [17, 21],
			name: 'unused',
			shapeType: 'wall',
			shapeLiteral: {
				texture: './img/textures/beach.jpg',
				size: [8, 20, 10]
			}
		});
		this.sprite?.create();
	}
	/*protected override _delete() {
		console.log('delete');
	}*/
}

export default wall3d;