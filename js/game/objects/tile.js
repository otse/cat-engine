import baseobject from "./base object.js";
import sprite from "../sprite.js";
export class tile extends baseobject {
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
        this.sprite?.create();
    }
    _delete() {
        console.log('hiiide');
    }
}
export default tile;
