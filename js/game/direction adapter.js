import rome from "../rome.js";
import game_object from "./objects/game object.js";
;
export class direction_adapter {
    gabeObject;
    target;
    shape;
    constructor(gabeObject) {
        this.gabeObject = gabeObject;
    }
    search() {
        const matrix = game_object.SortMatrix(rome.world, this.gabeObject.wpos, ['wall', 'wall 3d']);
        const directions = game_object.GetDirections(matrix);
    }
}
export default direction_adapter;
