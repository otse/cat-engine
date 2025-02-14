import game_object from "./game object.js";
import sprite from "../sprite.js";
import glob from "../../dep/glob.js";
import pts from "../../dep/pts.js";
// Legacy just use tile 3d
export class tile extends game_object {
    constructor(data) {
        super({
            name: 'a tile',
            ...data
        });
        this.wpos = pts.floor(this.wpos);
        this.data._type = 'tile';
    }
    _create() {
        new sprite({
            gobj: this,
            spriteSize: glob.hexSize
        });
        this.sprite?.create();
    }
}
export default tile;
