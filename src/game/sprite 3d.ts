import glob from "../dep/glob.js";
import pts from "../dep/pts.js";

import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";

// Todo put shapes in shapes.ts

interface sprite3d_literal extends sprite.literal_, tileform.shape_literal {

}

export namespace sprite3d {
	export type literaltype = sprite3d['data'];
};

export class sprite3d extends sprite {
	rerender = true
	target
	shape3d?: tileform.shape_base
	data_: sprite3d_literal // Hack
	constructor(
		data: sprite3d_literal
	) {
		super({
			shapeType: 'nothing',
			shapeTexture: './img/textures/stonemixed.jpg',
			shapeHexTexture: './img/textures/overgrown.jpg',
			shapeSize: [10, 10],
			...data
		});
		this.data_ = this.data as sprite3d_literal;
	}
	protected _create() {
		super._create();
		this.shape3d = tileform.shapeMaker(
			this.data_.shapeType!,
			this.data_);
		this.shape3d?.create();
		this.prerender();
	}
	protected override _step() {
		super._step();
		this.shape3d?.step();
		this.prerender();
	}
	prerender() {
		if (!this.rerender && !glob.rerender) // If both are false
			return;
		this._make_target();
		this._render();
		this.material.map = this.target.texture;
		this.material.needsUpdate = true;
		this.rerender = false;
	}
	protected _make_target() {
		let { spriteSize: size } = this.data;
		size = pts.mult(size!, glob.scale);
		this.target = pipeline.makeRenderTarget(
			size![0], size![1]);
	}
	protected _render() {
		tileform.stage.prepare(this);
		tileform.stage.render();
	}
}

export default sprite3d;