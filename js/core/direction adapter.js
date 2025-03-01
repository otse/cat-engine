import game_object from "./objects/game object.js";
import world_manager from "./world manager.js";
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
        this.matrix = game_object.helpers.sort_matrix(world_manager.world, this.gobj.wpos, types);
        this.directions = game_object.helpers.get_directions(this.matrix);
        // console.log('pos', this.gobj.wpos, this.matrix);
    }
    has_direction(dir) {
        return this.directions.includes(dir);
    }
    has_matrix(dir) {
        return this.directions.includes(dir);
    }
    index_of_direction(dir) {
        return this.directions.indexOf(dir);
    }
}
export default direction_adapter;
