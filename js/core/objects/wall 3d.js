import game_object from "./game object.js";
import object3d from "../object 3d.js";
import direction_adapter from "../direction adapter.js";
export class wall3d extends game_object {
    wallAdapter;
    constructor(data) {
        super({
            name: 'a wall 3d',
            ...data,
        });
        this.data._type = 'wall 3d';
        this.object3dmerge.groundPreset = 'water';
        this.wallAdapter = new direction_adapter(this);
    }
    _create() {
        new object3d({
            gobj: this,
            shapeSize: [16, 8, 11],
            shapeType: 'wall'
        });
        this.wallAdapter.search(['wall 3d']);
        this.object3d?.create();
    }
}
export default wall3d;
