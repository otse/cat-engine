import gobj from "./gobj.js";
import sprite from "../sprite.js";
export class tile extends gobj {
    constructor(data) {
        super({
            name: 'a tile',
            ...data,
            // _type: 'tile' // Won't work
        });
        this.data._type = 'tile';
        new sprite({ bound: this, size: [12, 8] });
        console.log('tile', this.data);
    }
}
export default tile;
