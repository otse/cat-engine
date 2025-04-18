import glob from "./../../dep/glob.js";
import pts from "../../dep/pts.js";
import lod from "../lod.js";
export class game_object extends lod.obj {
    data;
    // Most game objects represent a single object3d or sprite
    object3d;
    sprite;
    // Rotation
    r = 0;
    // Third axis
    z = 0;
    constructor(data) {
        super(glob.gobjscount);
        this.data = data;
        this.data = {
            name: 'a game object',
            // _wpos: [0, 0, 0],
            extra: {},
            ...data
        };
        this.wpos = pts.copy(data._wpos);
        this.z = data._wpos[2];
        this.r = data._r || 0;
        this._wtorpos();
        this.rpos = (pts.floor(this.rpos));
    }
    update() {
        this.sprite?.update();
    }
    _create() {
        console.warn(' game object empty create ');
    }
    _delete() {
        this.sprite?.delete();
        this.object3d?.delete();
    }
    _step() {
        super._step();
        this.sprite?.step();
        this.object3d?.step();
    }
}
// Contains TypeScript, beware!
(function (game_object) {
    let helpers;
    (function (helpers) {
        function get_matrix(world, wpos) {
            return lod.helpers.get_matrix(world, wpos);
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
