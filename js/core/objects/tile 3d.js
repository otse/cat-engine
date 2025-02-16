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
        this.preset = presets[preset] || presets['default'];
        this.data._type = 'tile 3d';
    }
    _create() {
        new sprite3d({
            ...this.preset,
            gobj: this,
            spriteSize: glob.hexSize,
            shapeSize: [1, 1, 1],
            shapeType: 'hex',
        });
        this.sprite?.create();
    }
}
const presets = {
    default: {
        gobj: {},
        shapeGroundTexture: './img/textures/beach.jpg',
        shapeGroundTextureNormal: './img/textures/beachnormal.jpg',
    },
    stonemixed: {
        gobj: {},
        shapeGroundTexture: './img/textures/stonemixed2.jpg',
        shapeGroundTextureNormal: './img/textures/stonemixed2normal.jpg',
    },
    cobblestone: {
        gobj: {},
        shapeGroundTexture: './img/textures/cobblestone3.jpg',
        shapeGroundTextureNormal: './img/textures/cobblestone3normal.jpg',
    }
};
export default tile3d;
