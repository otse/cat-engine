import glob from "../dep/glob.js";
import pts from "../dep/pts.js";
import game from "../eye/game.js";

import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";

export interface sprite3dliteral extends sprite.literal, tileform.shape3d.literal {
	groundPreset?: game.groundPreset
}

export namespace sprite3d {
	export type literal = sprite3dliteral;
};

export class sprite3d extends sprite {
	reprerender
	target
	shape?: tileform.shape3d
	data_: sprite3dliteral
	shapedata_: tileform.shape3d.literal
	constructor(
		data: sprite3dliteral
	) {
		let groundData = game.groundPresets[data.groundPreset!];
		super({
			bottomSort: false,
			...data,
			...groundData,
		} as sprite3d.literal);
		this.reprerender = true;
		this.data_ = this.data;
		this.shapedata_ = this.data;
	}
	protected _delete() {
		super._delete();
		this.shape?.delete();
	}
	protected _create() {
		super._create();
		console.log(this);
		
		this.shape = tileform.shapeMaker(
			this.shapedata_!.shapeType!,
			this.shapedata_!);
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
		if (this.reprerender == false && glob.reprerender == false)
			return;
		this._render();
		this.material.map = this.target.texture;
		this.material.needsUpdate = true;
		this.reprerender = false;
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


export default sprite3d;