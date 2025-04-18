import aabb2 from "../dep/aabb2.js";
import glob from "../dep/glob.js";
import pts from "../dep/pts.js";
import { hooks } from "../dep/hooks.js";

import renderer from "./renderer.js"; // Begone!
import toggle from "../dep/toggle.js";
import worldetch__ from "./worldetch.js";

// Welcome to the chaos of worldetch! 🌍🔥

// The LOD 👑

// Coordinate systems:
// The xtoypos-functions are used to convert between chunk space, world space, 
// and render or pixel space (wpos, cpos and rpos)

// The LOD is pretty simple. It has a world, a grid (the observer), chunks and objects.

// A worldetch game object parents a lob.obj

namespace lod {

	type tally = [active: number, total: number]

	const chunk_coloration = false;

	const fog_of_war = false;

	const grid_crawl_makes_chunks = false;

	export const chunk_span = 3;

	export function make_world() {
		const world = new lod.world(10);
		return world;
	}

	export function register() {
		// hooks.create('sectorCreate')
		// hooks.create('sectorShow')
		// hooks.create('sectorHide')
		// hooks.register('sectorHide', () => { console.log('~'); return false; } );
	}

	export function project(unit: vec2): vec2 {
		return (pts.mult(pts.project(unit, worldetch__.hex_size), worldetch__.scale));
	}

	export function unproject(pixel: vec2): vec2 {
		return (pts.divide(pts.unproject(pixel, worldetch__.hex_size), worldetch__.scale));
	}

	export function add(world: world, obj?: obj, show = true) {
		if (!obj)
			return;
		world._chunkatwpos(obj.wpos).add(obj, show);
	}

	export function remove(obj: obj) {
		obj.chunk?.remove(obj);
	}

	export class world {
		// Comment for programmer!:
		// By design the LOD only has a single "observer" (the grid)
		// If you need more grids, for filtering purposes
		// or for creating larger or smaller "skirts",
		// decouple the grid from the world here
		// then make sure the optional grids don't hide or show chunks 
		grid: grid
		readonly arrays: chunk[][] = []
		constructor(useless_value) { // Useless value
			this.grid = new grid(this, 2, 2);
		}
		update(wpos: vec2) {
			this.grid.cpos = lod.world._wtocpos(wpos);
			this.grid.ons();
			this.grid.offs();
			this.grid.runs();
		}
		_lookup(big: vec2): chunk | undefined {
			if (this.arrays[big[1]] == undefined)
				this.arrays[big[1]] = [];
			return this.arrays[big[1]][big[0]];
		}
		_chunkatcpos(cpos: vec2): chunk {
			return this._lookup(cpos) || this._make(cpos);
		}
		_chunkatwpos(wpos: vec2 | vec3): chunk {
			return this._chunkatcpos(world._wtocpos(wpos));
		}
		protected _make(cpos): chunk {
			let ch = this._lookup(cpos);
			if (ch)
				return ch;
			return this.arrays[cpos[1]][cpos[0]] = new chunk(cpos, this);
		}
		static _wtocpos(wpos: vec2 | vec3): vec2 {
			return (pts.floor(pts.divide(wpos, chunk_span)));
		}
		// todo add(obj) {}
		// todo remove(obj) {}
	}

	export class chunk extends toggle {
		group
		color?
		fog_of_war = false
		readonly small: aabb2
		readonly objs: obj[] = []
		constructor(
			public readonly cpos: vec2,
			readonly world: world
		) {
			super();
			if (chunk_coloration)
				this.color = (['lightsalmon', 'lightblue', 'beige', 'pink'])[Math.floor(Math.random() * 4)];
			let min = (pts.mult(this.cpos, chunk_span));
			let max = (pts.add(min, [chunk_span - 1, chunk_span - 1]));
			this.small = new aabb2(max, min);
			this.group = new THREE.Group;
			this.group.frustumCulled = false;
			this.group.matrixAutoUpdate = false;
			numbers.chunks[1]++;
			world.arrays[this.cpos[1]][this.cpos[0]] = this;
			//console.log('sector');

			hooks.emit('chunkCreate', this);

		}
		nuke() {
			numbers.chunks[1]--;
			this.hide();
			for (const obj of this.objs) {
				obj.finalize();
			}
			this.objs.splice(0, this.objs.length);
			this.objs.length = 0;
		}
		add(obj: obj, show) {
			if (this.objs.includes(obj) == false) {
				this.objs.push(obj);
				obj.chunk = this;
				if (this.active && show)
					obj.show();
			}
		}
		remove(obj: obj): boolean | undefined {
			let i = this.objs.indexOf(obj);
			if (i > -1) {
				obj.chunk = null;
				return !!this.objs.splice(i, 1).length;
			}
		}
		// Get all things at one point
		_objsatwpos(wpos: vec2) {
			const stack: obj[] = [];
			for (const obj of this.objs)
				if (pts.equals(
					pts.round(wpos),
					pts.round(obj.wpos)))
					stack.push(obj);
			return stack;
		} 
		// Whenever you move a game object, call me:
		static swap(obj: obj) {
			let oldChunk = obj.chunk!;
			let newChunk = oldChunk.world._chunkatwpos(/*pts.round(*/obj.wpos/*)*/);
			// the pts.round causes an impossible to find bug
			if (oldChunk != newChunk) {
				oldChunk.remove(obj);
				newChunk.add(obj, true);
				if (!newChunk.active)
					obj.hide();
			}
		}
		tick() {
			hooks.emit('chunkTick', this);
			//for (let obj of this.objs)
			//	obj.tick();
		}
		show() {
			if (this.on())
				return;
			numbers.chunks[0]++;
			for (const obj of this.objs)
				obj.show();
			renderer.scene.add(this.group);
			hooks.emit('chunkShow', this);
		}
		hide() {
			if (this.off())
				return;
			numbers.chunks[0]--;
			for (const obj of this.objs)
				obj.hide();
			renderer.scene.remove(this.group);
			hooks.emit('chunkHide', this);
		}
		dist() {
			return pts.distsimple(this.cpos, this.world.grid.cpos);
		}
		grayscale() {
			this.color = 'gray';
		}
	}

	export class grid { // the observer
		cpos: vec2 = [0, 0];
		public shown: chunk[] = [];
		visibleObjs: obj[] = []
		constructor(
			readonly world: world,
			public spread: number,
			public outside: number
		) {
			if (this.outside < this.spread) {
				console.warn(' outside less than spread ', this.spread, this.outside);
				this.outside = this.spread;
			}
		}
		grow() {
			this.spread++;
			this.outside++;
		}
		shrink() {
			this.spread--;
			this.outside--;
		}
		visible(chunk: chunk) {
			return chunk.dist() < this.spread;
		}
		ons() {
			// spread = -2; < 2
			for (let y = -this.spread; y < this.spread + 1; y++) {
				for (let x = -this.spread; x < this.spread + 1; x++) {
					let pos = (pts.add(this.cpos, [x, y]));
					let chunk = grid_crawl_makes_chunks ? this.world._chunkatcpos(pos) : this.world._lookup(pos);
					if (!chunk)
						continue;
					if (!chunk.active) {
						this.shown.push(chunk);
						chunk.show();
						// console.log(' show ');
						// todo why
						// for (let obj of sector.objs)
						// obj.step();
					}
				}
			}
		}
		offs() {
			// Hide sectors
			this.visibleObjs = [];
			let i = this.shown.length;
			while (i--) {
				let chunk: chunk;
				chunk = this.shown[i];
				if (chunk.dist() > this.outside) {
					chunk.hide();
					this.shown.splice(i, 1);
				}
				else {
					chunk.tick();
					this.visibleObjs = this.visibleObjs.concat(chunk.objs);
				}

				if (fog_of_war) {
					if (chunk.dist() >= this.outside) { // == outside or => ?
						chunk.fog_of_war = true;
						//sector.color = '#555555';
					}
					else {
						chunk.fog_of_war = false;
						//sector.color = '#ffffff';
					}
				}
			}
		}
		runs() {
			for (let chunk of this.shown)
				for (let obj of chunk.objs)
					obj.step();
		}
	}

	interface ObjHints {

	};

	export class obj extends toggle {
		static ids = 0
		id = -1
		wpos: vec2 = [0, 0]
		rpos: vec2 = [0, 0]
		size: vec2 = [64, 64]
		chunk: chunk | null
		bound: aabb2
		expand = .5
		constructor(
			public readonly counts = numbers.objs
		) {
			super();
			this.counts[1]++;
			this.id = obj.ids++;
		}
		finalize() {
			// this.hide();
			this.counts[1]--;
			this.hide();
		}
		show() {
			if (this.on())
				return;
			this.counts[0]++;
			this._create();
			// this.step();
			// this.shape?.show();
		}
		hide() {
			if (this.off())
				return;
			this.counts[0]--;
			this._delete();
			//this.shape?.hide();
			// console.log(' obj.hide ');
		}
		rebound() {
			this.bound = new aabb2([-this.expand, -this.expand], [this.expand, this.expand]);
			this.bound.translate(this.wpos);
		}
		_wtorpos() {
			this.rpos = (lod.project(this.wpos));
			this.rpos = pts.floor(this.rpos);
		}
		_rtospos() {
			// Screen pos
			this._wtorpos();
			return pts.copy(this.rpos);
		}
		//create() { // Use show() instead!
		//	this._create();
		//}
		// delete() { // Use hide() instead!
		//	this._delete();
		//}
		step() {
			this._step();
		}
		protected _create() {
			console.warn(' empty create ');
		}
		protected _delete() {
		}
		// Todo,
		// Use getters and setters to maintain rpos to wpos
		protected _step() {
			this._wtorpos();
			this.rebound();
		}
	}

	export namespace helpers {
		export function get_every_chunk(world: world) {
			let chunks: chunk[] = [];
			for (const i in world.arrays) {
				for (const j in world.arrays[i]) {
					chunks.push(world.arrays[i][j]);
				}
			}
			return chunks;
		}

		// Build a surrounding "matrix" of game objects
		export function get_matrix<Type>(world: world, center: vec2) {
			const directions: vec2[] = [
				[-1, 1], [0, 1], [1, 1],
				[-1, 0], [0, 0], [1, 0],
				[-1, -1], [0, -1], [1, -1]
			];
			let matrix: Type[][] = [];
			directions.forEach((pos, index) => {
				pos = (pts.add(pos, center));
				matrix[index] = world._chunkatwpos(pos)._objsatwpos(pos) as Type[];
			});
			return matrix;
		}


	}

	export namespace numbers {
		export var chunks: tally = [0, 0]
		export var objs: tally = [0, 0]

		export var sprites: tally = [0, 0]
		export var tiles: tally = [0, 0]
		export var walls: tally = [0, 0]
	};
}

export default lod;