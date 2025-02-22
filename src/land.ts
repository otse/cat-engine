import clod from "./core/clod.js";
import game_object from "./core/objects/game object.js";
import tile3d from "./core/objects/tile 3d.js";
import rome from "./rome.js";

/// generates land

// https://github.com/josephg/noisejs

namespace land {
	export function init() {

	}

	export function make() {
		// woo
		noise.seed(28); // 1 to 65536
		const gobjs: game_object[] = [];
		const baseWidth = 100;
		const baseHeight = 100;
		const width = 10;
		const height = 10;
		for (let y = 0; y < baseWidth; y++) {
			for (let x = 0; x < baseHeight; x++) {
				const point = noise.simplex2(x / width, y / height);
				let tilePreset = 'default';
				if (point < 0) {
					if (point < -0.6) {
						tilePreset = 'cobblestone';
					}
					else if (point < -0.3) {
						tilePreset = 'stonemixed';
					}
					const tile = new tile3d({
						_type: 'direct',
						_wpos: [(-baseWidth / 2) + x, (-baseHeight / 2) + y, 0]
					}, tilePreset);
					gobjs.push(tile);
				}
			}
		}
		rome.addLateGobjsBatch(gobjs, 'merge');
	}

	export function fill() {
		const gobjs: game_object[] = [];
		const baseWidth = 100;
		const baseHeight = 100;
		const width = 10;
		const height = 10;
		for (let y = 0; y < baseWidth; y++) {
			for (let x = 0; x < baseHeight; x++) {
				let tilePreset = rome.sample(['default', 'cobblestone', 'stonemixed']);
				const tile = new tile3d({
					_type: 'direct',
					_wpos: [(-baseWidth / 2) + x, (-baseHeight / 2) + y, 0]
				}, tilePreset);
				gobjs.push(tile);
			}
		}
		rome.addLateGobjsBatch(gobjs, 'merge');
	}
}

export default land;