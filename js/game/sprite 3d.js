import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";
;
export class sprite3d extends sprite {
    target;
    shape;
    constructor(data) {
        super(data);
        this.shape = tileform.shapeMaker(data.shapeType, data.shapeLiteral);
        this.renderCode();
        this.render();
    }
    _create() {
        super._create();
        this.material.map = this.target.texture;
        this.material.needsUpdate = true;
        tileform.stage.group.position.set(0, 0, 0);
        tileform.stage.group.updateMatrix();
    }
    renderCode() {
        this.target = pipeline.makeRenderTarget(this.data.size[0], this.data.size[1]);
    }
    render() {
        tileform.stage.prepare(this);
        tileform.stage.render();
    }
}
export default sprite3d;
