import game_object from "./game object.js";
import sprite3d from "../sprite 3d.js";
export class wall3d extends game_object {
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
        new sprite3d({
            gabeObject: this,
            size: [17, 21],
            name: 'hex/wall.png',
            shapeType: 'wall',
            shapeLiteral: {
                texture: './img/textures/stonemixed.jpg'
            }
        });
        this.sprite?.create();
    }
}
export default wall3d;
