
import glob from "../../dep/glob.js";
import pts from "../../dep/pts.js";
import clod from "../clod.js";
import sprite from "../sprite.js";

export namespace game_object {
	export type literalType = game_object['data'];
}

export class game_object extends clod.obj {
	static _gabeObjects: game_object[] = []
	sprite?: sprite
	r = 0 // rotation
	z = 0 // third axis
	constructor(public data: game_object_literal) {
		super(undefined);
		this.wpos = pts.copy(data._wpos);
		this.z = data._wpos[2];
		this.r = data._r || 0;
		this.wtorpos();
		if (!data.lonely) {
			glob.rome.addGabeObject(this);
			game_object._gabeObjects.push(this);
		}
	}
	purge() {
		this.sprite?.delete();
		glob.rome.removeGabeObject(this);
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
	}
}

// Messy
export namespace game_object {
	export function SortMatrix(world: clod.world, wpos: vec2, types: string[]) {
		return clod.util.GetMatrix<game_object>(
			world, wpos).map(column => column.filter(obj => types.includes(obj.data._type!)));
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