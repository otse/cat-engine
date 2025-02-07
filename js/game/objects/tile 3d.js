import game_object from "./game object.js";
import sprite3d from "../sprite 3d.js";
export class tile extends game_object {
    constructor(data) {
        super({
            name: 'a tile 3d',
            ...data
        });
        this.data._type = 'tile 3d';
    }
    _create() {
        new sprite3d({
            gobj: this,
            spriteSize: [17, 9],
            shapeType: 'hex',
            shapeHexTexture: './img/textures/beach.jpg',
            shapeSize: [8, 20, 10]
        });
        this.sprite?.create();
    }
}
export default tile;
