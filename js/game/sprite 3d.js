import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";
;
export class sprite3d extends sprite {
    data;
    target;
    shape3d;
    constructor(data) {
        super({
            shapeType: 'nothing',
            shapeLiteral: {
                hexTexture: '',
                texture: '',
                size: [0, 0]
            },
            ...data
        });
        this.data = data;
    }
    _create() {
        super._create();
        this.shape3d = tileform.shapeMaker(this.data.shapeType, this.data.shapeLiteral);
        this.shape3d?.create();
        this.prerender();
    }
    _step() {
        super._step();
        this.shape3d?.step();
        this.prerender();
    }
    prerender() {
        this._make_target();
        this._render();
        this.material.map = this.target.texture;
        this.material.needsUpdate = true;
    }
    _make_target() {
        this.target = pipeline.makeRenderTarget(this.data.size[0], this.data.size[1]);
    }
    _render() {
        tileform.stage.prepare(this);
        tileform.stage.render();
    }
}
export default sprite3d;
