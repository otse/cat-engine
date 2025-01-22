import app from "./app.js";
import { hooks } from "./dep/hooks.js";
import pipeline from "./game/pipeline.js";
import tileform from "./game/tileform.js";
import tile from "./game/objects/tile.js";
import tile3d from "./game/objects/tile 3d.js";
import wall from "./game/objects/wall.js";
import wall3d from "./game/objects/wall 3d.js";
import sprite from "./game/sprite.js";

import zoom from "./game/components/zoom.js";
import pan from "./game/components/pan.js";
import game_object from "./game/objects/game object.js";
import clod from "./game/clod.js";
import glob from "./dep/glob.js";

namespace rome {

	export const size = 8;

	export function sample(a) {
		return a[Math.floor(Math.random() * a.length)];
	}

	export function clamp(val, min, max) {
		return val > max ? max : val < min ? min : val;
	}

	export var world: clod.world;

	export async function init() {
		console.log(' init ');
		glob.rome = rome;
		await pipeline.init();
		await tileform.init();
		world = clod.init();
		app;
		make_gabe_objects();
		zoom.register();
		pan.register();
		// new sprite({ size: [12, 8] });
	}

	export function addGabeObject(gabeObject: game_object) {
		clod.add(world, gabeObject);
	}

	export function removeGabeObject(gabeObject: game_object) {
		clod.remove(gabeObject);
	}

	function make_gabe_objects() {
		new tile3d({ _type: 'direct', colorOverride: 'pink', _wpos: [-1, 0, 0] });
		new tile3d({ _type: 'direct', colorOverride: 'salmon', _wpos: [-1, -1, 0] });
		new tile3d({ _type: 'direct', colorOverride: 'cyan', _wpos: [0, -1, 0] });
		new tile3d({ _type: 'direct', colorOverride: 'yellow', _wpos: [-1, 1, 0] });
		new tile3d({ _type: 'direct', colorOverride: 'yellow', _wpos: [0, 1, 0] });
		new tile3d({ _type: 'direct', colorOverride: 'salmon', _wpos: [0, 2, 0] });
		new tile3d({ _type: 'direct', colorOverride: 'yellow', _wpos: [0, 3, 0] });
		new tile3d({ _type: 'direct', colorOverride: 'orange', _wpos: [0, 4, 0] });
		new tile3d({ _type: 'direct', colorOverride: 'red', _wpos: [0, 5, 0] });
		new tile3d({ _type: 'direct', colorOverride: 'blue', _wpos: [0, 6, 0] });
		new tile3d({ _type: 'direct', colorOverride: 'wheat', _wpos: [0, 7, 0] });
		new tile3d({ _type: 'direct', colorOverride: 'lavender', _wpos: [0, 8, 0] });
		new tile3d({ _type: 'direct', colorOverride: 'cyan', _wpos: [0, 9, 0] });
		new tile({ _type: 'direct', colorOverride: 'orange', _wpos: [1, -1, 0] });
		new tile({ colorOverride: 'red', _wpos: [0, 0, 0] });
		new tile({ name: 'ass', colorOverride: 'pink', _wpos: [1, 0, 0] });
		new tile({ _type: 'direct', colorOverride: 'blue', _wpos: [0, 1, 0] });
		new tile({ _type: 'direct', _wpos: [1, 1, 0] });
		new tile({ _type: 'direct', _wpos: [0, 2, 0] });
		new tile({ _type: 'direct', _wpos: [1, 0, 0] });
		new tile({ _type: 'direct', _wpos:	 [2, 0, 0] });
		new tile({ _type: 'direct', _wpos: [3, 0, 0] });
		new tile({ _type: 'direct', _wpos: [4, 0, 0] });
		new tile({ _type: 'direct', _wpos: [5, 0, 0] });
		new tile({ _type: 'direct', _wpos: [6, 0, 0] });
		new tile({ _type: 'direct', _wpos: [7, 0, 0] });
		new wall3d({ _type: 'direct', _wpos: [2, 1, 0] });
		new wall3d({ _type: 'direct', _wpos: [3, 1, 0] });
		new wall({ _type: 'direct', _wpos: [4, 1, 0] });
		new wall({ _type: 'direct', _wpos: [5, 1, 0] });
		new tile({ _type: 'direct', _wpos: [3, 2, 0] });
		new tile({ _type: 'direct', _wpos: [4, 2, 0] });
	}

	export function step() {
		hooks.emit('romeComponents', 1);
		hooks.emit('romeStep', 0);

		// Todo fix this double update
		world.update(pan.wpos);
		world.grid.ticks();

		const remakeObjects = () => {
			game_object._gabeObjects.forEach(gabeObject => gabeObject.purge());
			game_object._gabeObjects = [];
			make_gabe_objects();
		}
		if (app.key('[') == 1) {
			tileform.hex_size -= .1;
			console.log(tileform.hex_size);
			remakeObjects();
		}
		if (app.key(']') == 1) {
			tileform.hex_size += .1;
			console.log(tileform.hex_size);
			remakeObjects();;
		}
	}

}

export default rome;