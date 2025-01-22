
import glob from "../../dep/glob.js";
import pts from "../../dep/pts.js";
import clod from "../clod.js";
import sprite from "../sprite.js";

export namespace base_object {

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

export default game_object;