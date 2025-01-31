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

	export const tileSize: vec2 = [17, 9]; // glob?

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
		glob.prerender = true;
		glob.scale = 1;
		await preload_basic_textures();
		await pipeline.init();
		await tileform.init();
		world = clod.init();
		app;
		makeGameObjects();
		zoom.register();
		pan.register();
		// new sprite({ size: [12, 8] });
	}

	// This is useful for adding walls,
	// or the direction adapters will stop working
	export function addMutipleGameObject(gobjs: game_object[]) {
		for (const gobj of gobjs) {
			clod.add(rome.world, gobj, false);
		}
		for (const gobj of gobjs) {
			if (gobj.chunk?.active)
				gobj.show();
		}
	}

	// Silly function to add to our parameter injection world
	export function addGameObject(gobj: game_object) {
		clod.add(world, gobj);
	}

	export function removeGameObject(gobj: game_object) {
		clod.remove(gobj);
	}

	async function preload_basic_textures() {
		await pipeline.preloadTextureAsync('./img/hex/tile.png', 'nearest');
		await pipeline.preloadTextureAsync('./img/hex/wall.png', 'nearest');
	}

	function makeGameObjects() {
		let gobjs: game_object[] = [];
		function collect(gobj: game_object) {
			gobjs.push(gobj);
		}
		collect(new tile3d({ _type: 'direct', colorOverride: 'pink', _wpos: [-1, 0, 0] }));
		collect(new tile3d({ _type: 'direct', colorOverride: 'salmon', _wpos: [-1, -1, 0] }));
		collect(new tile3d({ _type: 'direct', colorOverride: 'cyan', _wpos: [0, -1, 0] }));
		collect(new tile3d({ _type: 'direct', colorOverride: 'yellow', _wpos: [-1, 1, 0] }));
		collect(new tile3d({ _type: 'direct', colorOverride: 'yellow', _wpos: [0, 1, 0] }));
		collect(new tile3d({ _type: 'direct', colorOverride: 'salmon', _wpos: [0, 2, 0] }));
		collect(new tile3d({ _type: 'direct', colorOverride: 'yellow', _wpos: [0, 3, 0] }));
		collect(new tile3d({ _type: 'direct', colorOverride: 'orange', _wpos: [0, 4, 0] }));
		collect(new tile3d({ _type: 'direct', colorOverride: 'red', _wpos: [0, 5, 0] }));
		collect(new tile3d({ _type: 'direct', colorOverride: 'blue', _wpos: [0, 6, 0] }));
		collect(new tile3d({ _type: 'direct', colorOverride: 'wheat', _wpos: [0, 7, 0] }));
		collect(new tile3d({ _type: 'direct', colorOverride: 'lavender', _wpos: [0, 8, 0] }));
		collect(new tile3d({ _type: 'direct', colorOverride: 'cyan', _wpos: [0, 9, 0] }));
		collect(new tile({ _type: 'direct', colorOverride: 'orange', _wpos: [1, -1, 0] }));
		collect(new tile({ _type: 'direct', colorOverride: 'red', _wpos: [0, 0, 0] }));
		collect(new tile({ _type: 'direct', colorOverride: 'pink', _wpos: [1, 0, 0] }));
		collect(new tile({ _type: 'direct', colorOverride: 'blue', _wpos: [0, 1, 0] }));
		collect(new tile({ _type: 'direct', _wpos: [1, 1, 0] }));
		collect(new tile({ _type: 'direct', _wpos: [0, 2, 0] }));
		collect(new tile({ _type: 'direct', _wpos: [1, 0, 0] }));
		collect(new tile({ _type: 'direct', _wpos: [2, 0, 0] }));
		collect(new tile({ _type: 'direct', _wpos: [3, 0, 0] }));
		collect(new tile({ _type: 'direct', _wpos: [4, 0, 0] }));
		collect(new tile({ _type: 'direct', _wpos: [5, 0, 0] }));
		collect(new tile({ _type: 'direct', _wpos: [6, 0, 0] }));
		collect(new tile({ _type: 'direct', _wpos: [7, 0, 0] }));
		collect(new wall3d({ _type: 'direct', _wpos: [2, 1, 0] }));
		collect(new wall3d({ _type: 'direct', colorOverride: 'magenta', _wpos: [3, 1, 0] }));
		collect(new wall3d({ _type: 'direct', colorOverride: 'pink', _wpos: [3, 2, 0] }));
		collect(new wall3d({ _type: 'direct', colorOverride: 'blue', _wpos: [3, 3, 0] }));
		collect(new wall3d({ _type: 'direct', colorOverride: 'red', _wpos: [4, 3, 0] }));
		collect(new wall3d({ _type: 'direct', colorOverride: 'purple', _wpos: [5, 3, 0] }));
		collect(new wall({ _type: 'direct', _wpos: [4, 1, 0] }));
		collect(new wall({ _type: 'direct', _wpos: [5, 1, 0] }));
		collect(new tile({ _type: 'direct', _wpos: [3, 2, 0] }));
		collect(new tile({ _type: 'direct', _wpos: [4, 2, 0] }));
		collect(new wall3d({ _type: 'direct', _wpos: [1, 2, 0] }));
		collect(new wall3d({ _type: 'direct', _wpos: [1, 3, 0] }));
		collect(new wall3d({ _type: 'direct', _wpos: [1, 4, 0] }));
		collect(new wall3d({ _type: 'direct', _wpos: [1, 5, 0] }));
		collect(new wall3d({ _type: 'direct', _wpos: [1, 6, 0] }));
		// This is stupid
		addMutipleGameObject(gobjs);		
	}

	export function step() {
		hooks.emit('romeComponents', 1);
		hooks.emit('romeStep', 0);

		// Todo fix this double update
		world.update(pan.wpos);
		world.grid.ticks();

		const remakeObjects = () => {
			game_object._gameObjects.forEach(gobj => gobj.purge());
			game_object._gameObjects = [];
			makeGameObjects();
		}
		if (app.key('[') == 1) {
			tileform.hex_size -= .1;
			console.log(tileform.hex_size);
			remakeObjects();
		}
		if (app.key(']') == 1) {
			tileform.hex_size += .1;
			console.log(tileform.hex_size);
			remakeObjects();
		}
		if (app.key('-') == 1) {
			glob.scale -= .1;
			console.log(glob.scale);
			remakeObjects();
		}
		if (app.key('=') == 1) {
			glob.scale += .1;
			console.log(glob.scale);
			remakeObjects();;
		}

		glob.rerender = false;
	}

}

export default rome;