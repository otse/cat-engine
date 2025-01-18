/// This poorly named component turns basic models into tiles

import pipeline from "./pipeline.js";
import sprite from "./sprite.js";

namespace tileform {

	export async function init() {
		await stage.init();
		return;
	}

	export namespace stage {
		export var scene, group, camera, target, renderer, ambient, sun
	}

	export namespace stage {

		export async function init() {
			boot();
			makeBasicShapes();
		}

		async function boot() {
			const size = [24, 40];
			scene = new THREE.Scene();
			group = new THREE.Group();
			target = pipeline.makeRenderTarget(size[0], size[1]);
			camera = pipeline.makeOrthographicCamera(size[0], size[1]);
			scene.rotation.set(Math.PI / 6, Math.PI / 4, 0);
			group.rotation.set(-Math.PI / 2, 0, 0);
			ambient = new THREE.AmbientLight('#777');
			scene.add(ambient);
			const sunDistance = 100;
			sun = new THREE.DirectionalLight(0xffffff, 0.25);
			sun.position.set(-sunDistance, 0, sunDistance / 2);
			renderer = new THREE.WebGLRenderer({
				antialias: false,
			});
		}

		let boxx;
		let boz;
		async function makeBasicShapes() {
			
		}

		export function prepare(sprite: sprite3d) {
			group.add(sprite.shape!.mesh);
			pipeline.utilEraseChildren(group);
		}

		export function render() {
			renderer.setRenderTarget(target);
			renderer.clear();
			renderer.render(scene, camera);
		}
	}

	abstract class shape_base {
		mesh
		constructor() {
			this._create();
		}
		protected _create() {}
	}

	class shape_box extends shape_base {
		constructor() {
			super();
		}
		protected override _create() {
			const box = new THREE.BoxGeometry(10, 10, 10);
			const material = new THREE.MeshPhongMaterial({
				color: 'red',
				map: pipeline.loadTexture('img/moorish-ornaments.jpg', 0)
			});
			const mesh = new THREE.Mesh(box, material);
			this.mesh = mesh;
		}
	}

	function shapeMaker(type: shapez) {
		let shape: shape_base | undefined;
			switch (type) {
				case 'nothing':
					console.warn(' no type passed to factory ');
					break;
				case 'wall':
					shape = new shape_box();
					break;
			}
			return shape;
	}

	type shapez = 'nothing' | 'wall'

	interface sprite3dliteral extends sprite.literaltype {
		shape?: string
	}

	export namespace sprite3d {
		export type literaltype = sprite3d['data'];
	};

	export class sprite3d extends sprite {
		target
		shape?: shape_base
		constructor(
			shape: shapez,
			data: sprite3dliteral,
		) {
			super(data);
			this.shape = shapeMaker(shape);
			this.renderCode();
			this.render();
		}
		protected _create() {
			super._create();
			this.material.map = this.target.texture;
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
}

export default tileform;