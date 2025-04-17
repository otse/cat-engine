import game_object from "./game object.js";
import tile from "./tile.js";
import wall from "./wall.js";

// Ex:
// Objects come in as data from the network

export function game_object_factory(data: game_object_literal): game_object | undefined {
	let gobj: game_object | undefined;
	switch (data._type) {
		case 'direct':
			console.warn(' unset type passed to factory ');
			break;
		case 'tile':
			gobj = new tile(data);
			break;
		case 'wall':
			gobj = new wall(data);
			break;
	}
	return gobj;
}

export default game_object_factory;