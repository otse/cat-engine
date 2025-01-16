import gobj from "./gobj.js";
import sprite from "../sprite.js";
export class wall extends gobj {
    constructor(data) {
        super({
            name: 'a wall',
            ...data,
        });
        this.data._type = 'wall';
        console.log('wall', this.data);
        this._create();
    }
    _create() {
        new sprite({
            gobj: this,
            size: [17, 21],
            name: 'hex/wall.png'
        });
    }
}
export default wall;
