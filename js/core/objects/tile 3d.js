import glob from "../../dep/glob.js";
import game_object from "./game object.js";
import sprite3d from "../sprite 3d.js";
export class tile3d extends game_object {
    preset;
    constructor(data, preset = 'default') {
        super({
            name: 'a tile 3d',
            ...data
        });
        this.preset = preset;
        this.sprite3dliteral = {
            sprite3dGroundPreset: preset
        };
        this.data._type = 'tile 3d';
    }
    _create() {
        new sprite3d({
            gobj: this,
            spriteSize: glob.hexSize,
            sprite3dGroundPreset: this.preset,
            shapeSize: [1, 1, 1],
            shapeType: 'hex',
            ...this.sprite3dliteral,
        });
        this.sprite?.create();
    }
}
export default tile3d;
