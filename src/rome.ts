import app from "./app.js";
import { hooks } from "./lib/hooks.js";
import pipeline from "./game/pipeline.js";
import sprite from "./game/sprite.js";

import zoom from "./game/components/zoom.js";

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
		new sprite({ size: [12, 8] });
	}

	export function step() {
		hooks.emit('romeStep', 0);
		
	}

}

export default rome;