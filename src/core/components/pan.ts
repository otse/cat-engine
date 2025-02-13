import { hooks } from "../../dep/hooks.js";
import app from "../../app.js";
import pts from "../../dep/pts.js";

import pipeline from "../pipeline.js";
import zoom from "./zoom.js";
import clod from "../clod.js";
import game_object from "../objects/game object.js";
import tile from "../objects/tile.js";
import rome from "../../rome.js";
import glob from "../../dep/glob.js";


namespace pan {

	export function register() {
		hooks.addListener('romeComponents', step);
		startup();
	}

	async function step() {
		functions();
		pipeline.camera.updateProjectionMatrix();
		return false;
	}

	let begin: vec2 = [0, 0];
	let before: vec2 = [0, 0];

	export let wpos: vec2 = [0, 0]
	export let rpos: vec2 = [0, 0]

	let stick: game_object | undefined = undefined

	const startWtorpos = true;
	const funnyJumpingRpos = false;

	var marker: game_object;

	function startup() {
		marker = new tile({
			_wpos: [0, 0, 0],
			colorOverride: 'purple',
			lonely: true,
		});
		marker.create();
		window['panMarker'] = marker;
	}

	function functions() {
		follow();
		// Pan the rpos
		pan();
		sideways();
		// Make a wpos from the nearest full pixel rpos
		wpos = clod.unproject(rpos);
		marker.wpos = wpos;
		marker.wtorpos();
		marker.update();
		// Jump to nearest full pixel
		if (funnyJumpingRpos)
			rpos = pts.round(rpos);
		set_camera();
		//lod.gworld.update(wpos);
	}

	function follow() {
		if (stick) {
			let wpos = stick.wpos;
			// Todo .5 ?
			wpos = pts.add(wpos, [.5, .5]);
			rpos = clod.project(wpos);
		}
		else {
			if (startWtorpos)
				rpos = clod.project(wpos);
			// rpos = pts.add(rpos, clod.project([.5, .5]));
		}
	}

	function sideways() {
		if (app.key('arrowright')) {
			rpos[0] += 1 * glob.scale;
		}
		if (app.key('arrowleft')) {
			rpos[0] -= 1 * glob.scale;
		}
		if (app.key('arrowup')) {
			rpos[1] += 1 * glob.scale;
		}
		if (app.key('arrowdown')) {
			rpos[1] -= 1 * glob.scale;
		}
	}

	function pan() {
		let continousMode = false;
		const continuousSpeed = -100;
		const panDivisor = -1;
		if (app.button(1) == 1) {
			let mouse = app.mouse();
			mouse[1] = -mouse[1];
			begin = mouse;
			before = pts.copy(rpos);
		}
		if (app.button(1) >= 1) {
			let mouse = app.mouse();
			mouse[1] = -mouse[1];
			let dif = pts.subtract(begin, mouse);
			if (continousMode) {
				dif = pts.divide(dif, continuousSpeed);
				rpos = pts.add(rpos, dif);
			}
			else {
				dif = pts.divide(dif, panDivisor);
				// necessary mods
				dif = pts.mult(dif, pipeline.dotsPerInch);
				dif = pts.mult(dif, zoom.actualZoom());
				dif = pts.subtract(dif, before);
				rpos = pts.inv(dif);
			}
		}
		else if (app.button(1) == -1) {
			console.log('release');
			rpos = pts.round(rpos);
		}
	}

	function set_camera() {
		// let inv = pts.inv(this.rpos);
		// ren.groups.axisSwap.position.set(inv[0], inv[1], 0);
		const rpos2 = pts.add(rpos, pts.divide([0, pts.hexSize[1]], 2));
		pipeline.camera.position.set(rpos2[0], rpos2[1], 0);
	}

}

export default pan;