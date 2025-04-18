import game_object from "./objects/game object.js";
import world from "./world.js";
;
// The direction_adapter is used for managing cascading geometries
export class direction_adapter {
    gobj;
    target;
    shape3d;
    matrix = [[]];
    directions = [];
    constructor(gobj) {
        this.gobj = gobj;
        // []
    }
    search(types) {
        this.matrix = game_object.helpers.sort_matrix(world.default_world.world, this.gobj.wpos, types);
        this.directions = game_object.helpers.get_directions(this.matrix);
        // console.log('pos', this.gobj.wpos, this.matrix);
    }
    get_all_objects_at(direction) {
        const i = this.directions.indexOf(direction);
        if (i !== -1) {
            return this.matrix[i];
        }
    }
    tile_occupied(direction) {
        return this.directions.includes(direction);
    }
    has_matrix(direction) {
        return this.directions.includes(direction);
    }
    index_of_direction(direction) {
        return this.directions.indexOf(direction);
    }
}
export default direction_adapter;
