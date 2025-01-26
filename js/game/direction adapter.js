import rome from "../rome.js";
import clod from "./clod.js";
;
export class direction_adapter {
    gabeObject;
    target;
    shape;
    constructor(gabeObject) {
        this.gabeObject = gabeObject;
    }
    search() {
        const around = clod.util.getSurrounding(rome.world, this.gabeObject.wpos);
        console.log('objects surrounding us', around);
        around.forEach(obj => {
            console.log('360 ', obj.wpos, obj.data.name);
        });
        rome.world.grid.visibleObjs;
    }
}
export default direction_adapter;
