import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";

// Todo put shapes in shapes.ts

interface sprite3dliteral extends sprite.literalType {
	shapeType: tileform.shape_types,
	shapeLiteral: tileform.shape_literal
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
		super(data);
		this.shape = tileform.shapeMaker(
			this.data.shapeType,
			this.data.shapeLiteral);
		this.renderCode();
		this.render();
	}
	protected _create() {
		super._create();
		this.material.map = this.target.texture;
		this.material.needsUpdate = true;
		tileform.stage.group.position.set(0, 0, 0);
		tileform.stage.group.updateMatrix();
	}
	renderCode() {
		this.target = pipeline.makeRenderTarget( 
			this.data.size![0], this.data.size![1]);
	}
	render() {
		tileform.stage.prepare(this);
		tileform.stage.render();
	}
}

export default sprite3d;