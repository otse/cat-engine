import rome from "../rome.js";
import game_object from "./objects/game object.js";
;
export class direction_adapter {
    gobj;
    target;
    shape;
    matrix;
    directions;
    constructor(gobj) {
        this.gobj = gobj;
        //[]
    }
    search(types) {
        this.matrix = game_object.SortMatrix(rome.world, this.gobj.wpos, types);
        console.log('pos', this.gobj.wpos, this.matrix);
        this.directions = game_object.GetDirections(this.matrix);
    }
}
export default direction_adapter;
