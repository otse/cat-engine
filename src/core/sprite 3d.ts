import glob from "../dep/glob.js";
import pts from "../dep/pts.js";

import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";

export interface sprite3d_joint_literal extends sprite.literal, tileform.shape3d.literal {
	groundPreset?: string;
}

export namespace sprite3d {
	export type literaltype = sprite3d['data_'];
};

export class sprite3d extends sprite {
	rerender
	target
	shape?: tileform.shape3d
	data_: sprite3d_joint_literal
	constructor(
		data: sprite3d_joint_literal
	) {
		let groundPreset = sprite3d.groundPresets[data.groundPreset!];
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
		this.data_ = this.data as sprite3d_joint_literal;
		this.rerender = true;
	}
	protected _delete() {
		super._delete();
		this.shape?.delete();
	}
	protected _create() {
		super._create();
		this.shape = tileform.shapeMaker(
			this.data_.shapeType!,
			this.data_);
		this.shape?.create();
		this._make_target();
		this.prerender();
	}
	protected override _step() {
		super._step();
		this.shape?.step();
		this.prerender();
	}
	prerender() {
		// If both are false
		if (this.rerender == false && glob.rerender == false)
			return;
		this._render();
		this.material.map = this.target.texture;
		this.material.needsUpdate = true;
		this.rerender = false;
	}
	protected _make_target() {
		let { spriteSize } = this.data;
		spriteSize = (pts.mult(spriteSize!, glob.scale));
		this.target = pipeline.makeRenderTarget(spriteSize[0], spriteSize[1]);
	}
	protected _render() {
		tileform.stage.prepare(this);
		tileform.stage.render();
	}
}

// this data should be owned by the game
// and maybe attached to glob. or us a hooks?
export namespace sprite3d {
	export const groundPresets: { [index: string]: sprite3d.literaltype } = {
		default: {
			gobj: {} as any,
			shapeGroundTexture: './img/textures/beach.jpg',
			shapeGroundTextureNormal: './img/textures/beachnormal.jpg',
		},
		stonemixed: {
			gobj: {} as any,
			shapeGroundTexture: './img/textures/stonemixed2.jpg',
			shapeGroundTextureNormal: './img/textures/stonemixed2normal.jpg',
		},
		cobblestone: {
			gobj: {} as any,
			shapeGroundTexture: './img/textures/cobblestone3.jpg',
			shapeGroundTextureNormal: './img/textures/cobblestone3normal.jpg',
		}
	}
}

export default sprite3d;