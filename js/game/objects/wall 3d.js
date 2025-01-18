import baseobject from "./base object.js";
import tileform from "../tileform.js";
export class wall3d extends baseobject {
    constructor(data) {
        super({
            name: 'a wall 3d',
            ...data,
        });
        this.data._type = 'wall 3d';
        console.log('wall', this.data);
        this._create();
    }
    _create() {
        new tileform.spriteshape('sandwall', {
            gobj: this,
            size: [17, 21],
            name: 'hex/wall.png'
        });
    }
}
export default wall3d;
