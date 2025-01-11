import app from "./app.js";
import { hooks } from "./lib/hooks.js";

namespace rome {
	
	export function sample(a) {
		return a[Math.floor(Math.random() * a.length)];
	}

	export function clamp(val, min, max) {
		return val > max ? max : val < min ? min : val;
	}

	export function init() {
		console.log(' init ');
		
		app;
	}

	export function step() {
		hooks.emit('romeStep', 0);
	}
	
}

export default rome;