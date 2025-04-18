import game_object from "./game object.js";
import sprite from "../sprite.js";
import pts from "../../dep/pts.js";
import worldetch__ from "../worldetch.js";
// Welcome to the chaos of worldetch! 🌍🔥
// Legacy just use tile 3d
export class tile extends game_object {
    constructor(data) {
        super({
            name: 'a tile',
            ...data
        });
        this.wpos = (pts.floor(this.wpos));
        this.data._type = 'tile';
    }
    _create() {
        new sprite({
            gobj: this,
            spriteSize: worldetch__.hex_size,
        });
        this.sprite?.create();
    }
}
export default tile;
