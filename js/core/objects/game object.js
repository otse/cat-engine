import glob from "../../dep/glob.js";
import pts from "../../dep/pts.js";
import clod from "../clod.js";
export class game_object extends clod.obj {
    data;
    // A lot(!) of game objects are represented by an image or sprite
    sprite;
    // Lots of game objects make sprite3ds so here's an initialization object
    sprite3dliteral;
    // Add user data
    extra = {};
    // Rotation
    r = 0;
    // Third axis
    z = 0;
    constructor(data) {
        super(glob.gameobjects);
        this.data = data;
        this.wpos = pts.copy(data._wpos);
        this.z = data._wpos[2];
        this.r = data._r || 0;
        this.wtorpos();
        this.rpos = (pts.floor(this.rpos));
    }
    purge() {
        // console.log('purge');
        this.finalize();
    }
    update() {
        this.sprite?.update();
    }
    _create() {
        console.warn(' game object empty create ');
    }
    _delete() {
        this.sprite?.delete();
    }
    _step() {
        super._step();
        this.sprite?.step();
    }
}
// Contains TypeScript stuff, beware!
(function (game_object) {
    let helpers;
    (function (helpers) {
        function get_matrix(world, wpos) {
            return clod.helpers.get_matrix(world, wpos);
        }
        helpers.get_matrix = get_matrix;
        function sort_matrix(world, wpos, types) {
            return get_matrix(world, wpos).map(column => column.filter(obj => types.includes(obj.data._type)));
        }
        helpers.sort_matrix = sort_matrix;
        //export type direction = 'northwest' | 'north' | 'northeast' | 'west' | 'center' | 'east' | 'southwest' | 'south' | 'southeast'
        function get_directions(matrix) {
            const directions = [
                'northwest', 'north', 'northeast',
                'west', 'center', 'east',
                'southwest', 'south', 'southeast'
            ];
            return directions.map((dir, index) => matrix[index].length > 0 ? dir : null);
        }
        helpers.get_directions = get_directions;
    })(helpers = game_object.helpers || (game_object.helpers = {}));
})(game_object || (game_object = {}));
export default game_object;
