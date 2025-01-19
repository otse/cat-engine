/// This poorly named component turns basic models into tiles

import glob from "../dep/glob.js";
import pipeline from "./pipeline.js";
import sprite from "./sprite.js";

namespace tileform {

	export async function init() {
		await stage.init();
		return;
	}

	export namespace stage {
		export let scene, group, camera, renderer, ambient, sun
		export let spotlight: sprite3d | undefined
	}

	export namespace stage {

		export async function init() {
			await boot();
		}

		async function boot() {
			scene = new THREE.Scene();
			// scene.background = new THREE.Color('purple');
			scene.rotation.set(Math.PI / 6, Math.PI / Math.PI, 0);
			camera = new THREE.OrthographicCamera(100 / - 2, 100 / 2, 100 / 2, 100 / - 2, -100, 100);
			group = new THREE.Group();
			group.rotation.set(-Math.PI / 2, 0, 0);
			group.updateMatrix();
			scene.add(group);
			scene.updateMatrix();
			ambient = new THREE.AmbientLight('white', 1);
			scene.add(ambient);
			const sunDistance = 100;
			sun = new THREE.DirectionalLight('yellow', 1);
			sun.position.set(-sunDistance, 0, sunDistance / 2);
			scene.add(sun);
			renderer = new THREE.WebGLRenderer({
				antialias: false,
			});
			renderer.setPixelRatio(glob);
			renderer.setSize(100, 100);
			renderer.setClearColor(0xffffff, 1);
			renderer.autoClear = true;
			renderer.toneMapping = THREE.NoToneMapping;
			// document.body.appendChild(renderer.domElement);
		}

		export function prepare(sprite: sprite3d) {
			spotlight = sprite;
			const size = sprite.data.size!;
			camera = new THREE.OrthographicCamera(
				size[0] / - 2,
				size[0] / 2,
				size[1] / 2,
				size[1] / - 2,
				-100, 100);
			while (group.children.length > 0)
				group.remove(group.children[0]);
			group.add(sprite.shape!.mesh);
		}

		export function render() {
			// Todo: Using our own stage renderer gives us a black result
			glob.renderer.setRenderTarget(spotlight!.target);
			glob.renderer.clear();
			glob.renderer.render(scene, camera);
			glob.renderer.setRenderTarget(null);
		}
	}

	abstract class shape_base {
		mesh
		constructor() {
			this._create();
		}
		protected _create() { }
	}

	class shape_box extends shape_base {
		constructor() {
			super();
		}
		protected override _create() {
			const box = new THREE.BoxGeometry(10, 16, 10);
			const material = new THREE.MeshPhongMaterial({
				color: 'red',
				//map: pipeline.loadTexture('img/moorish-ornaments.jpg', 0)
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
			// this.material.transparent = false;
			this.material.map = this.target.texture;
			this.material.needsUpdate = true;
			stage.group.position.set(0, 0, 0);
			stage.group.updateMatrix();
		}
		renderCode() {
			this.target = pipeline.makeRenderTarget(
				this.data.size![0], this.data.size![1]);
		}
		render() {
			stage.prepare(this);
			stage.render();
		}
	}
}

export default tileform;