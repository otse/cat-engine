import glob from "../dep/glob.js";
import pts from "../dep/pts.js";
import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";
;
export class sprite3d extends sprite {
    reprerender;
    target;
    shape;
    data_;
    constructor(data) {
        let groundPreset = sprite3d.groundPresets[data.groundPreset];
        super({
            shapeType: 'nothing',
            shapeTexture: './img/textures/stonemixed.jpg',
            // Find a nice checkers texture
            shapeGroundTexture: './img/textures/stonemixed.jpg',
            shapeGroundTextureNormal: './img/textures/stonemixednormal.jpg',
            shapeSize: [10, 10],
            bottomSort: false,
            ...groundPreset,
            ...data
        });
        this.data_ = this.data;
        this.reprerender = true;
    }
    _delete() {
        super._delete();
        this.shape?.delete();
    }
    _create() {
        super._create();
        this.shape = tileform.shapeMaker(this.data_.shapeType, this.data_);
        this.shape?.create();
        this._make_target();
        this.prerender();
    }
    _step() {
        super._step();
        this.shape?.step();
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
(function (sprite3d) {
    sprite3d.groundPresets = {
        default: {
            gobj: {},
            shapeGroundTexture: './img/textures/beach.jpg',
            shapeGroundTextureNormal: './img/textures/beachnormal.jpg',
        },
        stonemixed: {
            gobj: {},
            shapeGroundTexture: './img/textures/stonemixed2.jpg',
            shapeGroundTextureNormal: './img/textures/stonemixed2normal.jpg',
        },
        cobblestone: {
            gobj: {},
            shapeGroundTexture: './img/textures/cobblestone3.jpg',
            shapeGroundTextureNormal: './img/textures/cobblestone3normal.jpg',
        }
    };
})(sprite3d || (sprite3d = {}));
export default sprite3d;
