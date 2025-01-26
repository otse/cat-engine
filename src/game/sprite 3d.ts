import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";

// Todo put shapes in shapes.ts

interface sprite3dliteral extends sprite.literalType {
	scenePreset: tileform.scene_preset,
	shapeType?: tileform.shape_types,
	shapeLiteral?: tileform.shape_literal
}

export namespace sprite3d {
	export type literaltype = sprite3d['data'];
};

export class sprite3d extends sprite {
	target
	shape?: tileform.shape_base
	constructor(
		public readonly data: sprite3dliteral
	) {
		super({
			shapeType: 'nothing',
			shapeLiteral: {
				hexTexture: '',
				texture: '',
				size: [10, 10]
			},
			...data
		});
	}
	protected _create() {
		super._create();
		this.shape = tileform.shapeMaker(
			this.data.shapeType!,
			this.data.shapeLiteral!);
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