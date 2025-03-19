import glob from "./../dep/glob.js";
import pts from "../dep/pts.js";
import game from "../eye/game.js";
import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";
;
export class sprite3d extends sprite {
    reprerender;
    target;
    shape;
    data_;
    shapedata_;
    constructor(data) {
        let groundData = game.groundPresets[data.gobj.sprite3dliteral?.groundPreset || data.groundPreset];
        super({
            bottomSort: false,
            ...data,
            ...groundData,
            ...data.gobj.sprite3dliteral
        });
        this.reprerender = true;
        this.data_ = this.data;
        this.shapedata_ = this.data;
    }
    _delete() {
        super._delete();
        this.shape?.delete();
        this.target?.dispose();
    }
    _create() {
        super._create();
        //console.log(this);
        this.shape = tileform.shapeMaker(this.shapedata_.shapeType, this.shapedata_);
        this.shape?.create();
        return;
        this._make_target();
        this.prerender();
    }
    _step() {
        super._step();
        this.shape?.step();
        return;
        this.prerender();
    }
    prerender() {
        // If both are false
        if (this.reprerender == false && glob.reprerender == false)
            return;
        this._render();
        this.material.map = this.target.texture;
        this.material.needsUpdate = true;
        this.reprerender = false;
    }
    _make_target() {
        let { spriteSize } = this.data;
        spriteSize = (pts.mult(spriteSize, glob.scale));
        this.target = pipeline.makeRenderTarget(spriteSize[0], spriteSize[1]);
    }
    _render() {
        tileform.stage.prepare(this);
        tileform.stage.render();
    }
}
// this data should be owned by the game
// and maybe attached to glob. or us a hooks?
export default sprite3d;
