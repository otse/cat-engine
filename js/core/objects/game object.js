import glob from "../../dep/glob.js";
import pts from "../../dep/pts.js";
import clod from "../clod.js";
export class game_object extends clod.obj {
    data;
    static _gameObjects = [];
    sprite;
    r = 0; // rotation
    z = 0; // third axis
    constructor(data) {
        super(undefined);
        this.data = data;
        this.wpos = pts.copy(data._wpos);
        this.z = data._wpos[2];
        this.r = data._r || 0;
        this.wtorpos();
        game_object._gameObjects.push(this);
    }
    purge() {
        this._delete();
        glob.rome.removeGobj(this);
    }
    update() {
        this.sprite?.update();
    }
    _delete() {
        this.sprite?.delete();
    }
    _create() {
        console.warn(' gabe object empty create ');
    }
    _step() {
        super._step();
    }
}
// Messy
(function (game_object) {
    function SortMatrix(world, wpos, types) {
        const matrix = clod.util.GetMatrix(world, wpos);
        return matrix.map(column => column.filter(obj => types.includes(obj.data._type)));
    }
    game_object.SortMatrix = SortMatrix;
    function GetDirections(matrix) {
        const directions = [
            'northwest', 'north', 'northeast',
            'west', 'center', 'east',
            'southwest', 'south', 'southeast'
        ];
        return directions.map((dir, index) => matrix[index].length > 0 ? dir : null);
    }
    game_object.GetDirections = GetDirections;
})(game_object || (game_object = {}));
export default game_object;
