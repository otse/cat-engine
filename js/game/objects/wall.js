import baseobject from "./base object.js";
import sprite from "../sprite.js";
export class wall extends baseobject {
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
            gabeObject: this,
            size: [17, 21],
            name: 'hex/wall.png',
            color: 'blue'
        });
        this.sprite?.create();
    }
}
export default wall;
