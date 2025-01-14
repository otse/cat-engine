import gobj from "./gobj.js";
import sprite from "../sprite.js";
export class tile extends gobj {
    constructor(data) {
        super({
            name: 'a tile',
            ...data,
            // _type: 'tile'
            // Oops will overwrite subclass 'bettertile'
        });
        this.data._type = 'tile';
        console.log('tile', this.data);
        this._create();
    }
    _create() {
        new sprite({ bound: this, size: [12, 8] });
    }
}
export default tile;
