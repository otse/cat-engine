import { hooks } from "../../dep/hooks.js";
import app from "../../app.js";
import pts from "../../dep/pts.js";

import pipeline from "../pipeline.js";
import zoom from "./zoom.js";
import clod from "../clod.js";
import game_object from "../objects/game object.js";
import tile from "../objects/tile.js";
import glob from "../../dep/glob.js";


namespace pan {

	export function register() {
		hooks.addListener('romeComponents', step);
		startup();
	}

	async function step() {
		functions();
		return false;
	}

	export let wpos: vec2 = [0, 0]
	export let rpos: vec2 = [0, 0]

	let stick: game_object | undefined = undefined

	// At the start of our functions, compute the Rpos from the Wpos
	const rposIsAlwaysWposBased = true;

	// The marker moves in full tiles
	const roundWposMarker = false;

	// Rpos will always be rounded to full game or render pixels
	const roundRpos = true;

	// Punish the player after dragging the camera
	const dragReleaseRoundsToNearestFullPixel = false;

	var marker: game_object;

	function startup() {
		marker = new tile({
			_wpos: [0, 0, 0],
			colorOverride: 'purple',
			lonely: true,
		});
		marker.show();
		window['panMarker'] = marker;
	}

	function functions() {
		follow();
		pan_rpos();
		arrow_keys();
		if (roundRpos)
			rpos = (pts.round(rpos));
		// After the rpos, we always want our wpos
		// Could be floating point
		wpos = (clod.unproject(rpos));
		marker.wpos = wpos;
		if (roundWposMarker)
			marker.wpos = (pts.round(clod.unproject(rpos)));
		marker.wtorpos();
		marker.update();
		// Jump to nearest full pixel
		
		set_camera();
		//lod.gworld.update(wpos);
	}

	function follow() {
		if (stick) {
			let wpos = stick.wpos;
			wpos = (pts.add(wpos, [.5, .5])); // ?
			rpos = (clod.project(wpos));
		}
		else {
			if (rposIsAlwaysWposBased) {
				rpos = (clod.project(wpos));
			}
		}
	}

	function arrow_keys() {
		if (app.key('arrowright')) {
			rpos[0] += 1 * glob.scale;
			glob.rerenderObjects = true;
		}
		if (app.key('arrowleft')) {
			rpos[0] -= 1 * glob.scale;
			glob.rerenderObjects = true;
		}
		if (app.key('arrowup')) {
			rpos[1] += 1 * glob.scale;
			glob.rerenderObjects = true;
		}
		if (app.key('arrowdown')) {
			rpos[1] -= 1 * glob.scale;
			glob.rerenderObjects = true;
		}
	}

	let begin: vec2 = [0, 0];
	let before: vec2 = [0, 0];

	function pan_rpos() {
		const continuousMode = false;
		const continuousSpeed = -100;
		const panDirection = -1;
		if (app.button(1) == 1) {
			let mouse = app.mouse();
			mouse[1] = -mouse[1];
			begin = mouse;
			before = pts.copy(rpos);
		}
		if (app.button(1) >= 1) {
			glob.rerenderObjects = true;
			let mouse = app.mouse();
			mouse[1] = -mouse[1];
			let dif = (pts.subtract(begin, mouse));
			if (continuousMode) {
				dif = (pts.divide(dif, continuousSpeed));
				rpos = (pts.add(rpos, dif));
			}
			else {
				dif = (pts.divide(dif, panDirection));
				// Scale
				dif = (pts.mult(dif, glob.dotsPerInch));
				dif = (pts.mult(dif, zoom.scale()));
				dif = (pts.subtract(dif, before));
				rpos = (pts.inv(dif));
			}
		}
		else if (app.button(1) == -1) {
			console.log('release');
			if (dragReleaseRoundsToNearestFullPixel)
				rpos = (pts.round(rpos));
		}
	}

	function set_camera() {
		const rpos2 = (pts.add(rpos, pts.divide([0, glob.hexSize[1]], 2)));
		pipeline.groups.camera.position.x = rpos2[0];
		pipeline.groups.camera.position.y = rpos2[1];
		pipeline.groups.camera.updateMatrix();
		pipeline.camera.updateProjectionMatrix();
	}

}

export default pan;