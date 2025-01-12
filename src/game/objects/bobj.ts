
import pts from "../../lib/pts.js";
import lod from "../lod.js";

type oproptype =
	'Car' | 'Ped' | 'Ply' | 'Block' | 'Floor';

export namespace baseobj {

}

export class bobj extends lod.obj {
	r = 0 // rotation
	z = 0 // third axis
	constructor(public data: bobj_literal) {
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

export default bobj;