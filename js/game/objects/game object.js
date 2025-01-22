import glob from "../../dep/glob.js";
import pts from "../../dep/pts.js";
import clod from "../clod.js";
export class game_object extends clod.obj {
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
    _delete() {
        this.sprite?.delete();
    }
    _create() {
        console.warn(' gabe object empty create ');
    }
    _step() {
        super._step();
    }
}
export default game_object;
