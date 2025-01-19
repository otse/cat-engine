import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";

abstract class shape_base {
	mesh
	constructor(readonly data: shapeLiteral) {
		this._create();
	}
	protected _create() { }
}

interface shapeLiteral {
	texture: string
}

class shape_box extends shape_base {
	constructor(data: shapeLiteral) {
		super(data);
		this._create();
	}
	protected override _create() {
		const box = new THREE.BoxGeometry(15, 20, 10);
		const material = new THREE.MeshPhongMaterial({
			color: 'red',
			map: pipeline.loadTexture(this.data.texture, 0)
		});
		const mesh = new THREE.Mesh(box, material);
		this.mesh = mesh;
	}
}

function shapeMaker(type: shapez, data: shapeLiteral) {
	let shape: shape_base | undefined;
	switch (type) {
		case 'nothing':
			console.warn(' no type passed to factory ');
			break;
		case 'wall':
			shape = new shape_box(data);
			break;
	}
	return shape;
}

type shapez = 'nothing' | 'wall'

interface sprite3dliteral extends sprite.literalType {
	shapeType: shapez,
	shapeLiteral: shapeLiteral
}

export namespace sprite3d {
	export type literaltype = sprite3d['data'];
};

export class sprite3d extends sprite {
	target
	shape?: shape_base
	constructor(
		public readonly data: sprite3dliteral
	) {
		super(data);
		this.shape = shapeMaker(
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