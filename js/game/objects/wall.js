import game_object from "./game object.js";
import sprite from "../sprite.js";
// Legacy just use wall 3d
export class wall extends game_object {
    constructor(data) {
        super({
            name: 'a wall',
            ...data,
        });
        this.data._type = 'wall';
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
