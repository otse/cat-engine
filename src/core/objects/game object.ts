
import glob from "../../dep/glob.js";
import pts from "../../dep/pts.js";
import clod from "../clod.js";
import sprite from "../sprite.js";

export namespace game_object {
	export type literalType = game_object['data'];
}

export class game_object extends clod.obj {
	static _gameObjects: game_object[] = []
	// A lot of game objects are represented by an image or sprite
	sprite?: sprite
	// Rotation
	r = 0
	// Third axis
	z = 0
	constructor(public data: game_object_literal) {
		super(undefined);
		this.wpos = pts.copy(data._wpos);
		this.z = data._wpos[2];
		this.r = data._r || 0;
		this.wtorpos();
		game_object._gameObjects.push(this);
	}
	purge() {
		this._delete();
		glob.rome.removeGobj(this);
	}
	update() {
		this.sprite?.update();
	}
	protected override _delete() {
		this.sprite?.delete();
	}
	protected override _create() {
		console.warn(' gabe object empty create ');
	}
	protected override _step() {
		super._step();
		this.sprite?.step();
	}
}

// Messy
export namespace game_object {
	export function SortMatrix(world: clod.world, wpos: vec2, types: string[]) {
		const matrix = clod.util.GetMatrix<game_object>(world, wpos);
		return matrix.map(column => column.filter(obj => types.includes(obj.data._type!)));
	}
	export function GetDirections(matrix: game_object[][]) {
		const directions = [
			'northwest', 'north', 'northeast',
			'west', 'center', 'east',
			'southwest', 'south', 'southeast'
		];
		return directions.map((dir, index) => matrix[index].length > 0 ? dir : null);
	}
}

export default game_object;