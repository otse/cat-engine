import game_object from "./game object.js";
import object3d from "../object 3d.js";
// Welcome to the chaos of worldetch! 🌍🔥
export class tile3d extends game_object {
    preset;
    constructor(data, preset = 'default') {
        super({
            name: 'a tile 3d',
            ...data
        });
        this.preset = preset;
        this.data._type = 'tile 3d';
    }
    _create() {
        new object3d({
            gobj: this,
            shapeSize: [1, 1, 1],
            shapeType: 'hex',
            groundPreset: this.preset
        });
        this.object3d?.create();
    }
}
export default tile3d;
