import game_object from "./game object.js";
import sprite3d from "../sprite 3d.js";
import direction_adapter from "../direction adapter.js";
export class wall3d extends game_object {
    da;
    constructor(data) {
        super({
            name: 'a wall 3d',
            ...data,
        });
        this.data._type = 'wall 3d';
        this.da = new direction_adapter(this);
    }
    _create() {
        new sprite3d({
            gabeObject: this,
            size: [17, 21],
            name: 'unused',
            scenePreset: 'wall',
            shapeType: 'wall',
            shapeLiteral: {
                type: 'regular',
                texture: './img/textures/beach.jpg',
                size: [8, 14, 10]
            }
        });
        //this.da.search();
        this.sprite?.create();
    }
    /*protected override _delete() {
        console.log('delete');
    }*/
    _step() {
        super._step();
        this.sprite?.prerender();
    }
}
export default wall3d;
