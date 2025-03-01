import game from "../eye/game.js";
import rome from "../rome.js";
import clod from "./clod.js";
import game_object from "./objects/game object.js";
import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";
import world_manager from "./world manager.js";

interface sprite3dliteral extends sprite.literal {
	shapeType: tileform.shape_types,
	shapeLiteral: tileform.shape_literal
}

export namespace direction_adapter {
	
};

/// the DA is used for creating cascading geometries

// it doesn't adapt to directions but helps with adapting to directions

export class direction_adapter {
	target
	readonly shape3d?: tileform.shape3d
	matrix: game_object[][]
	directions: game_object.helpers.directions
	constructor(readonly gobj: game_object) {
		// []
	}
	search(types: string[]) {
		this.matrix = game_object.helpers.sort_matrix(world_manager.world, this.gobj.wpos, types);
		this.directions = game_object.helpers.get_directions(this.matrix);
		// console.log('pos', this.gobj.wpos, this.matrix);
	}
	tile_occupied(direction: game_object.helpers.direction) {
		return this.directions.includes(direction);
	}
	has_matrix(direction: game_object.helpers.direction) {
		return this.directions.includes(direction);
	}
	index_of_direction(direction: game_object.helpers.direction): number {
		return this.directions.indexOf(direction);
	}
}

export default direction_adapter;