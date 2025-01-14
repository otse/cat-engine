
import pts from "../../dep/pts.js";
import lod from "../lod.js";

export namespace gobj {

}

export class gobj extends lod.obj {
	r = 0 // rotation
	z = 0 // third axis
	constructor(public data: gobj_literal) {
		super(undefined);
		this.wpos = pts.copy(data._wpos);
		this.z = data._wpos[2];
		this.r = data._r || 0;
		this.wtorpos();
	}
	protected override _delete() {
	}
	protected override _create() {
		console.warn(' baseobj empty create ');
	}
	protected override _step() {
		super._step();
	}
}

export default gobj;