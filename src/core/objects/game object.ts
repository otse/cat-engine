
import glob from "./../../dep/glob.js";
import pts from "../../dep/pts.js";
import clod from "../clod.js";
import sprite from "../sprite.js";
import object3d from "../object 3d.js";

export namespace game_object {
	export type literal = game_object_literal;
}

export class game_object extends clod.obj {
	// A lot(!) of game objects are represented by an image or sprite
	sprite?: sprite
	object3d?: object3d
	// Lots of game objects make sprite3ds so here's an initialization object
	object3dmerge_: object3d.literal = { gobj: this }

	// Rotation
	r = 0
	// Third axis
	z = 0
	constructor(public data: game_object.literal) {
		super(glob.gobjscount);
		this.data = {
			name: 'a game object',
			// _wpos: [0, 0, 0],
			extra: {},
			...data
		};
		this.wpos = pts.copy(data._wpos);
		this.z = data._wpos[2];
		this.r = data._r || 0;
		this.wtorpos();
		this.rpos = (pts.floor(this.rpos));
	}
	update() {
		this.sprite?.update();
	}
	protected override _create() {
		console.warn(' game object empty create ');
	}
	protected override _delete() {
		this.sprite?.delete();
		this.object3d?.delete();
	}
	protected override _step() {
		super._step();
		this.sprite?.step();
		this.object3d?.step();
	}
}

// Contains TypeScript, beware!
export namespace game_object {
	export namespace helpers {

		export function get_matrix(world: clod.world, wpos: vec2) {
			return clod.helpers.get_matrix<game_object>(world, wpos);
		}

		export function sort_matrix(world: clod.world, wpos: vec2, types: string[]) {
			return get_matrix(world, wpos).map(column => column.filter(obj => types.includes(obj.data._type!)));
		}

		//export type direction = 'northwest' | 'north' | 'northeast' | 'west' | 'center' | 'east' | 'southwest' | 'south' | 'southeast'

		export function get_directions(matrix: game_object[][]) {
			const directions = [
				'northwest', 'north', 'northeast',
				'west', 'center', 'east',
				'southwest', 'south', 'southeast'
			] as const;
			return directions.map((dir, index) => matrix[index].length > 0 ? dir : null);
		}

		export type directions = ReturnType<typeof get_directions>;
		export type direction = directions[number];
	}
}

export default game_object;