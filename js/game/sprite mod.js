import tileform from "./tileform.js";
;
export class spriteadapter {
    target;
    shape;
    constructor() {
    }
    _create() {
        tileform.stage.group.updateMatrix();
    }
}
export default spriteadapter;
