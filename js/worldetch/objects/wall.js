import game_object from "./game object.js";
import sprite from "../sprite.js";
import glob from "./../../dep/glob.js";
// Legacy just use wall 3d
export class wall extends game_object {
    constructor(data) {
        super({
            name: 'a wall',
            ...data,
        });
        this.data._type = 'wall';
    }
    _create() {
        new sprite({
            gobj: this,
            bottomSort: true,
            spriteSize: [glob.hex_size[0], 21],
            spriteImage: 'hex/wall.png'
        });
        this.sprite?.create();
    }
}
export default wall;
