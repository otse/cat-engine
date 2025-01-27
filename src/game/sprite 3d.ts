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
	target
	shape3d?: tileform.shape_base
	constructor(
		public readonly data: sprite3dliteral
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
	}
	protected _create() {
		super._create();
		this.shape3d = tileform.shapeMaker(
			this.data.shapeType!,
			this.data.shapeLiteral!);
		this.shape3d?.create();
		this.prerender();
	}
	protected override _step() {
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
	protected _make_target() {
		this.target = pipeline.makeRenderTarget(
			this.data.size![0], this.data.size![1]);
	}
	protected _render() {
		tileform.stage.prepare(this);
		tileform.stage.render();
	}
}

export default sprite3d;