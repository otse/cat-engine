import pts from "../../lib/pts.js";
import lod from "../lod.js";
export class gobj extends lod.obj {
    data;
    r = 0; // rotation
    z = 0; // third axis
    constructor(data) {
        super(undefined);
        this.data = data;
        this.wpos = pts.copy(data._wpos);
        this.z = data._wpos[2];
        this.r = data._r || 0;
        this.wtorpos();
    }
    _delete() {
    }
    _create() {
        console.warn(' baseobj empty create ');
    }
    _step() {
        super._step();
    }
}
export default gobj;
