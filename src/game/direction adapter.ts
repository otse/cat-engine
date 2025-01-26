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
		const around = clod.util.getSurrounding(rome.world, this.gabeObject.wpos);
		console.log('objects surrounding us', around);
		around.forEach(obj => {
			console.log('360 ', obj.wpos, obj.data.name);
		});
		
		rome.world.grid.visibleObjs
		
	}
}

export default direction_adapter;