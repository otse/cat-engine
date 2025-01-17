
import pts from "../../dep/pts.js";
import lod from "../lod.js";
import sprite from "../sprite.js";

export namespace baseobject {

}

export class baseobject extends lod.obj {
	sprite?: sprite
	r = 0 // rotation
	z = 0 // third axis
	constructor(public data: baseobjectliteral) {
		super(undefined);
		this.wpos = pts.copy(data._wpos);
		this.z = data._wpos[2];
		this.r = data._r || 0;
		this.wtorpos();
	}
	protected override _delete() {
	}
	protected override _create() {
		console.warn(' gabe object empty create ');
	}
	protected override _step() {
		super._step();
	}
}

export default baseobject;