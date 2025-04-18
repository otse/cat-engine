import game_object from "./objects/game object.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";
import world from "./world.js";

// Welcome to the chaos of worldetch! 🌍🔥

interface sprite3dliteral extends sprite.literal {
	shapeType: tileform.shape_types,
	shapeLiteral: tileform.shape_literal
}

export namespace direction_adapter {
	
};

// The direction_adapter is used for managing cascading geometries

export class direction_adapter {
	target
	readonly shape3d?: tileform.shape3d
	matrix: game_object[][] = [[]]
	directions: game_object.helpers.directions = []
	constructor(readonly gobj: game_object) {
		// []
	}
	search(types: string[]) {
		this.matrix = game_object.helpers.sort_matrix(world.default_world.world, this.gobj.wpos, types);
		this.directions = game_object.helpers.get_directions(this.matrix);
		// console.log('pos', this.gobj.wpos, this.matrix);
	}
	get_all_objects_at(direction: game_object.helpers.direction) {
		const i = this.directions.indexOf(direction);
		if (i !== -1) {
			return this.matrix[i];
		}
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