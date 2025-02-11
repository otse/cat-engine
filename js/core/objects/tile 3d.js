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
            spriteSize: [17, 9],
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
    },
    overgrown: {
        gobj: {},
        shapeGroundTexture: './img/textures/overgrown.jpg',
    },
    cobblestone: {
        gobj: {},
        shapeGroundTexture: './img/textures/cobblestone2.jpg',
    }
};
export default tile3d;
