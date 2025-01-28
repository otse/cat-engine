import rome from "../rome.js";
import clod from "./clod.js";
import game_object from "./objects/game object.js";
import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";

// Todo put shapes in shapes.ts

interface sprite3dliteral extends sprite.literalType {
	shapeType: tileform.shape_types,
	shapeLiteral: tileform.shape_literal
}

export namespace direction_adapter {
	
};

export class direction_adapter {
	target
	shape?: tileform.shape_base
	constructor(readonly gabeObject: game_object) {
		
	}
	search() {
		type sd = game_object.literalType;
		const matrix = game_object.SortMatrix(
			rome.world, this.gabeObject.wpos, ['wall', 'wall 3d']);
		const directions = game_object.GetDirections(matrix);
	}
}

export default direction_adapter;