import app from "./app.js";
import { hooks } from "./lib/hooks.js";
import pipeline from "./game/pipeline.js";
import sprite from "./game/sprite.js";
import tile from "./game/objects/tile.js";

import zoom from "./game/components/zoom.js";
import bettertile from "./game/objects/better tile.js";

namespace rome {

	export const size = 8;

	export function sample(a) {
		return a[Math.floor(Math.random() * a.length)];
	}

	export function clamp(val, min, max) {
		return val > max ? max : val < min ? min : val;
	}

	export function init() {
		console.log(' init ');
		app;
		zoom.register();
		new tile({ _wpos: [0, 0, 0] });
		new bettertile({ name: 'ass', _wpos: [1, 0, 0] });
		new bettertile({ _type: 'wall', _wpos: [1, 1, 0] });
		//new sprite({ size: [12, 8] });
	}

	export function step() {
		hooks.emit('romeStep', 0);

	}

}

export default rome;