import game_object from "../core/objects/game object.js";
import tile3d from "../core/objects/tile 3d.js";
import game from "./game.js";
import world_manager from "../core/world manager.js";
import aabb2 from "../dep/aabb2.js";
import pts from "../dep/pts.js";
import staggered_area from "../core/staggered area.js";
import wall3d from "../core/objects/wall 3d.js";
import area2 from "../dep/area2.js";

/// generates land

// https://github.com/josephg/noisejs

namespace land {
	export function init() {
		// Does nothing!
	}

	class perlin_area {
		// perlin does not repeat but is repeatable
		constructor(
			seed: number,
			readonly scale: vec2,
		) {
			this._set(seed);
		}
		_set(seed: number) {
			noise.seed(seed);
		}
		get_simplex2(x, y) {
			const point = noise.simplex2(x / this.scale[0], y / this.scale[1]);
			return point;
		}
	}

	export function repopulate() {
		make();
		make_staggered_building();
		make_non_staggered_lake();
	}

	function make() {
		// woo
		noise.seed(28); // 1 to 65536
		const objects: game_object[] = [];
		const populate = [100, 100];
		const area = new perlin_area(28, [10, 10]);
		for (let y = 0; y < populate[0]; y++) {
			for (let x = 0; x < populate[1]; x++) {
				const point = area.get_simplex2(x, y);
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
						_wpos: [(-populate[0] / 2) + x, (-populate[1] / 2) + y, 0]
					}, tilePreset as game.groundPreset);
					objects.push(tile);
				}
			}
		}
		world_manager.addMergeLot(objects, 1);
	}

	function make_staggered_building() {
		const objects: game_object[] = [];
		const pos = [8, 0] as vec2;
		const size = [5, 5] as vec2;
		const aabb = new aabb2(pos, pts.add(pos, size));
		const staggeredArea = new staggered_area(aabb2.area(aabb));
		// staggeredArea._stagger();
		staggeredArea.do((point: area2.areaPoint) => {
			if (point.isBorder) {
				const wall = new wall3d({
					_type: 'direct',
					_wpos: [point.pos[0], point.pos[1], 0],
					extra: { staggerData: point },
					// colorOverride: 'green'
				}, 'elven');
				const tile = new tile3d({
					_type: 'direct',
					_wpos: [point.pos[0], point.pos[1], 0]
				}, 'star');
				objects.push(wall);
				objects.push(tile);
			}
			else {
				const tile = new tile3d({
					_type: 'direct',
					_wpos: [point.pos[0], point.pos[1], 0]
				}, 'star');
				objects.push(tile);
			}
		});
		world_manager.addMergeLot(objects, 1);
	}

	function make_non_staggered_lake() {
		const objects: game_object[] = [];
		const pos = [8, 8] as vec2;
		const size = [5, 5] as vec2;
		const aabb = new aabb2(pos, pts.add(pos, size));
		const area = aabb2.area(aabb);
		area.do((point: area2.areaPoint) => {
			if (point.isBorder) {
				const wall = new wall3d({
					_type: 'direct',
					_wpos: [point.pos[0], point.pos[1], 0]
					// colorOverride: 'green'
				}, 'basalt');
				objects.push(wall);
			}
			else {
				const tile = new tile3d({
					_type: 'direct',
					_wpos: [point.pos[0], point.pos[1], 0]
				}, 'water');
				objects.push(tile);
			}
		});
		world_manager.addMergeLot(objects, 2);
	}

	export function test_fill() {
		const gobjs: game_object[] = [];
		const baseWidth = 100;
		const baseHeight = 100;
		const width = 10;
		const height = 10;
		for (let y = 0; y < baseWidth; y++) {
			for (let x = 0; x < baseHeight; x++) {
				let tilePreset = 'default'; // rome.sample(['default', 'cobblestone', 'stonemixed']);
				const tile = new tile3d({
					_type: 'direct',
					_wpos: [(-baseWidth / 2) + x, (-baseHeight / 2) + y, 0]
				}, tilePreset as game.groundPreset);
				gobjs.push(tile);
			}
		}
		world_manager.addMergeLot(gobjs, 1);
	}

	export function make_bodies_of_water() {
		noise.seed(29); // 1 to 65536

	}
}

export default land;