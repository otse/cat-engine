import game_object from "./game object.js";
import sprite from "../sprite.js";
import pts from "../../dep/pts.js";
// Legacy just use tile 3d
export class tile extends game_object {
    constructor(data) {
        super({
            name: 'a tile',
            ...data
        });
        this.data._type = 'tile';
    }
    _create() {
        new sprite({
            gobj: this,
            spriteSize: pts.hexSize
        });
        this.sprite?.create();
    }
}
export default tile;
