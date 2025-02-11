import rome from "../rome.js";
import clod from "./clod.js";
import game_object from "./objects/game object.js";
import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";

interface sprite3dliteral extends sprite.literal {
	shapeType: tileform.shape_types,
	shapeLiteral: tileform.shape_literal
}

export namespace direction_adapter {
	
};

export class direction_adapter {
	target
	shape3d?: tileform.shape3d
	matrix: game_object[][]
	directions: (string | null)[]
	constructor(readonly gobj: game_object) {
		//[]
	}
	search(types: string[]) {
		this.matrix = game_object.SortMatrix(rome.world, this.gobj.wpos, types);
		this.directions = game_object.GetDirections(this.matrix);
		// console.log('pos', this.gobj.wpos, this.matrix);
	}
}

export default direction_adapter;