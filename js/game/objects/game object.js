import pts from "../../dep/pts.js";
import lod from "../lod.js";
export class game_object extends lod.obj {
    data;
    static _gabeObjects = [];
    sprite;
    r = 0; // rotation
    z = 0; // third axis
    constructor(data) {
        super(undefined);
        this.data = data;
        this.wpos = pts.copy(data._wpos);
        this.z = data._wpos[2];
        this.r = data._r || 0;
        this.wtorpos();
        game_object._gabeObjects.push(this);
    }
    purge() {
        this.sprite?.delete();
    }
    _delete() {
    }
    _create() {
        console.warn(' gabe object empty create ');
    }
    _step() {
        super._step();
    }
}
export default game_object;
