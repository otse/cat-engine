import gobj from "./gobj.js";
import sprite from "../sprite.js";
export class tile extends gobj {
    constructor(data) {
        super({
            name: 'a tile',
            ...data
        });
        this.data._type = 'tile';
        console.log('tile', this.data);
        this._create();
    }
    _create() {
        new sprite({
            gobj: this,
            size: [17, 9]
        });
    }
}
export default tile;
