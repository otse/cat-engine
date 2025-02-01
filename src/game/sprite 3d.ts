import glob from "../dep/glob.js";
import pts from "../dep/pts.js";

import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";

// Todo put shapes in shapes.ts

interface sprite3dliteral extends sprite.literalType {
	_scenePresetDepr: tileform.scene_preset,
	shapeType?: tileform.shape_types,
	shapeLiteral?: tileform.shape_literal
}

export namespace sprite3d {
	export type literaltype = sprite3d['data'];
};

export class sprite3d extends sprite {
	rerender = true
	target
	shape3d?: tileform.shape_base
	data_: sprite3dliteral // Hack
	constructor(
		data: sprite3dliteral
	) {
		super({
			shapeType: 'nothing',
			shapeLiteral: {
				hexTexture: '',
				texture: '',
				size: [0, 0]
			},
			...data
		});
		this.data_ = this.data as sprite3dliteral;
	}
	protected _create() {
		super._create();
		this.shape3d = tileform.shapeMaker(
			this.data_.shapeType!,
			this.data_.shapeLiteral!);
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
		let { size } = this.data;
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