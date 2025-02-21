import rome from "../rome.js";
import game_object from "./objects/game object.js";
;
/// the DA is used for creating cascading geometries
// it doesn't adapt to directions but helps with adapting to directions
export class direction_adapter {
    gobj;
    target;
    shape3d;
    matrix;
    directions;
    constructor(gobj) {
        this.gobj = gobj;
        // []
    }
    search(types) {
        this.matrix = game_object.helpers.sort_matrix(rome.world, this.gobj.wpos, types);
        this.directions = game_object.helpers.get_directions(this.matrix);
        // console.log('pos', this.gobj.wpos, this.matrix);
    }
    has_direction(dir) {
        return this.directions.includes(dir);
    }
    stagger;
}
export default direction_adapter;
