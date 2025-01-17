/// This poorly named component turns basic models into tiles

import pipeline from "./pipeline.js";
import sprite from "./sprite.js";

namespace tileform {

	export async function init() {
		const box = new THREE.BoxGeometry(20, 20, 20);
		const material = new THREE.MeshPhongMaterial({
			color: 'red',
			map: pipeline.loadTexture('img/moorish-ornaments.jpg', 0)
		});
		const mesh = new THREE.Mesh(box, material);
		mesh.rotation.set(Math.PI / 6, Math.PI / 4, 0);
		mesh.position.set(0, 0, 0);
		pipeline.scene.add(mesh);
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
			const box = new THREE.BoxGeometry(10, 10, 10);
			const material = new THREE.MeshPhongMaterial({
				color: 'red',
				map: pipeline.loadTexture('img/moorish-ornaments.jpg', 0)
			});
			const mesh = new THREE.Mesh(box, material);
			mesh.rotation.set(Math.PI / 6, Math.PI / 4, 0);
			mesh.position.set(0, 0, 0);
			boxx = mesh;
			const boz = new shape_or_model();
			boz.object = boxx;
		}

		export function prepare(model: shape_or_model) {
			group.add(model.object);
			pipeline.utilEraseChildren(group);
			// material.map = this.target.texture;

		}
		export function render() {
			renderer.setRenderTarget(target);
			renderer.clear();
			renderer.render(scene, camera);
		}
	}

	class shape_or_model {
		object
		constructor() {

		}
	}

	interface modelspriteliteral extends sprite.params {
		shape?: string
	}

	export class modelsprite extends sprite {
		target
		constructor(
			data: modelspriteliteral,
			readonly model?: shape_or_model
		) {
			super(data);
			this.basic();
		}
		basic() {
			this.target = pipeline.makeRenderTarget(
				this.data.size![0], this.data.size![1]);
		}
		render() {
			//tileform.stage.take(this);
			tileform.stage.render();
		}
	}
}

export default tileform;