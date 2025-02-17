import rome from "../rome.js";
import game_object from "./objects/game object.js";
;
export class direction_adapter {
    gobj;
    target;
    shape3d;
    matrix;
    directions;
    constructor(gobj) {
        this.gobj = gobj;
        //[]
    }
    search(types) {
        this.matrix = game_object.helpers.sort_matrix(rome.world, this.gobj.wpos, types);
        this.directions = game_object.helpers.get_directions(this.matrix);
        // console.log('pos', this.gobj.wpos, this.matrix);
    }
}
export default direction_adapter;
