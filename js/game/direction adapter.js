import rome from "../rome.js";
import game_object from "./objects/game object.js";
;
export class direction_adapter {
    gabeObject;
    target;
    shape;
    matrix;
    directions;
    constructor(gabeObject) {
        this.gabeObject = gabeObject;
        //[]
    }
    search(types) {
        this.matrix = game_object.SortMatrix(rome.world, this.gabeObject.wpos, types);
        this.directions = game_object.GetDirections(this.matrix);
    }
}
export default direction_adapter;
