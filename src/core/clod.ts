import aabb2 from "../dep/aabb2.js";
import glob from "../dep/glob.js";
import pts from "../dep/pts.js";
import { hooks } from "../dep/hooks.js";

import pipeline from "./pipeline.js"; // Begone!
import toggle from "../dep/toggle.js";

export namespace numbers {
	export type tally = [active: number, total: number]

	export var chunks: tally = [0, 0]
	export var objs: tally = [0, 0]

	export var sprites: tally = [0, 0]
	export var tiles: tally = [0, 0]
	export var walls: tally = [0, 0]
};

namespace clod {
	export const size = 9;

	const chunk_coloration = false;

	const fog_of_war = false;

	const grid_crawl_makes_chunks = true;

	export var SectorSpan = 4;

	export var stamp = 0; // used only by server slod

	export function init() {
		console.log('init');

		const world = new clod.world(10);
		return world;
	}

	export function register() {
		// hooks.create('sectorCreate')
		// hooks.create('sectorShow')
		// hooks.create('sectorHide')
		// hooks.register('sectorHide', () => { console.log('~'); return false; } );
	}

	export function project(unit: vec2): vec2 {
		return pts.mult(pts.project(unit), glob.scale);
	}

	export function unproject(pixel: vec2): vec2 {
		return pts.divide(pts.unproject(pixel), glob.scale);
	}

	export function add(world: world, obj?: obj) {
		if (!obj)
			return;
		world.atwpos(obj.wpos).add(obj);
	}

	export function addNoCreate(world: world, obj?: obj) {
		if (!obj)
			return;
		world.atwpos(obj.wpos).add(obj, false);
	}

	export function remove(obj: obj) {
		obj.chunk?.remove(obj);
	}

	export class world {
		// The client lod only has a single observer
		// If you need more, decouple it then make sure that
		// the grid does not start showing and hiding chunks
		grid: grid
		readonly arrays: chunk[][] = []
		constructor(useless_value) { // Useless value
			this.grid = new grid(this, 2, 2);
		}
		update(wpos: vec2) {
			this.grid.cpos = clod.world.wtocpos(wpos);
			this.grid.ons();
			this.grid.offs();
		}
		lookup(big: vec2): chunk | undefined {
			if (this.arrays[big[1]] == undefined)
				this.arrays[big[1]] = [];
			return this.arrays[big[1]][big[0]];
		}
		at(cpos: vec2): chunk {
			return this.lookup(cpos) || this._make(cpos);
		}
		atwpos(wpos: vec2 | vec3): chunk {
			return this.at(world.wtocpos(wpos));
		}
		protected _make(cpos): chunk {
			let s = this.lookup(cpos);
			if (s)
				return s;
			s = this.arrays[cpos[1]][cpos[0]] = new chunk(cpos, this);
			return s;
		}
		static wtocpos(units: vec2 | vec3): vec2 {
			return pts.floor(pts.divide(units, SectorSpan));
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
			let min = pts.mult(this.cpos, SectorSpan);
			let max = pts.add(min, [SectorSpan - 1, SectorSpan - 1]);
			this.small = new aabb2(max, min);
			this.group = new THREE.Group;
			this.group.frustumCulled = false;
			this.group.matrixAutoUpdate = false;
			numbers.chunks[1]++;
			world.arrays[this.cpos[1]][this.cpos[0]] = this;
			//console.log('sector');

			hooks.emit('sectorCreate', this);

		}
		add(obj: obj, show = true) {
			if (!this.objs.includes(obj)) {
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
		stacked(wpos: vec2) {
			const stack: obj[] = [];
			for (const obj of this.objs)
				if (pts.equals(
					pts.round(wpos),
					pts.round(obj.wpos)))
					stack.push(obj);
			return stack;
		}

		static swap(obj: obj) {
			// Call me whenever you move
			let oldChunk = obj.chunk!;
			let newChunk = oldChunk.world.atwpos(/*pts.round(*/obj.wpos/*)*/);
			// the pts.round causes an impossible to find bug
			if (oldChunk != newChunk) {
				oldChunk.remove(obj);
				newChunk.add(obj);
				if (!newChunk.active)
					obj.hide();
			}
		}
		tick() {
			hooks.emit('sectorTick', this);
			//for (let obj of this.objs)
			//	obj.tick();
		}
		show() {
			if (this.on())
				return;
			numbers.chunks[0]++;
			for (const obj of this.objs)
				obj.show();
			pipeline.scene.add(this.group);
			hooks.emit('sectorShow', this);
		}
		hide() {
			if (this.off())
				return;
			numbers.chunks[0]--;
			for (let obj of this.objs)
				obj.hide();
			pipeline.scene.remove(this.group);
			hooks.emit('sectorHide', this);
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
		visible(sector: chunk) {
			return sector.dist() < this.spread;
		}
		ons() {
			// spread = -2; < 2
			for (let y = -this.spread; y < this.spread + 1; y++) {
				for (let x = -this.spread; x < this.spread + 1; x++) {
					let pos = pts.add(this.cpos, [x, y]);
					let chunk = grid_crawl_makes_chunks ? this.world.at(pos) : this.world.lookup(pos);
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
					if (chunk.dist() == this.outside) {
						//console.log('brim-chunk');
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
		ticks() {
			for (const chunk of this.shown)
				for (const obj of chunk.objs)
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
			public readonly counts: numbers.tally = numbers.objs) {
			super();
			this.counts[1]++;
			this.id = obj.ids++;
		}
		finalize() {
			// this.hide();
			this.counts[1]--;
		}
		show() {
			if (this.on())
				return;
			this.counts[0]++;
			this.create();
			this.step(); // Cursor fixed the bug
			//this.shape?.show();
		}
		hide() {
			if (this.off())
				return;
			this.counts[0]--;
			this.delete();
			//this.shape?.hide();
			// console.log(' obj.hide ');
		}
		rebound() {
			this.bound = new aabb2([-this.expand, -this.expand], [this.expand, this.expand]);
			this.bound.translate(this.wpos);
		}
		wtorpos() {
			this.rpos = clod.project(this.wpos);
		}
		rtospos() {
			this.wtorpos();
			return pts.copy(this.rpos);
		}
		create() {
			this._create();
		}
		delete() {
			this._delete();
		}
		step() {
			this._step();
		}
		protected _create() {
			console.warn(' empty create ');
		}
		protected _delete() {
		}
		protected _step() {
			this.wtorpos();
			this.rebound();
		}
	}

	export namespace util {
		export function GetMatrix<Type>(world: world, wpos: vec2) {
			const directions: vec2[] = [
				[-1, 1], [0, 1], [1, 1],
				[-1, 0], [0, 0], [1, 0],
				[-1, -1], [0, -1], [1, -1]
			];
			let matrix: Type[][] = [];
			directions.forEach((pos, index) => {
				pos = pts.add(pos, wpos);
				matrix[index] = world.atwpos(pos).stacked(pos) as Type[];
			});
			return matrix;
		}

	}
}

export default clod;