/// This poorly named component turns basic 3d shapes into sprites

import glob from "../dep/glob.js";
import rome from "../rome.js";
import pipeline from "./pipeline.js";
import sprite3d from "./sprite 3d.js";
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
			await preload();
			await boot();
		}

		async function preload() {
			await pipeline.loadTextureAsync('./img/textures/stonemixed.jpg');
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
			/*renderer = new THREE.WebGLRenderer({
				antialias: false,
			});
			renderer.setPixelRatio(glob);
			renderer.setSize(100, 100);
			renderer.setClearColor(0xffffff, 1);
			renderer.autoClear = true;
			renderer.toneMapping = THREE.NoToneMapping;*/
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
			group.add(sprite.shape!.group);
		}

		export function render() {
			// Todo: stage renderer doesn't render anything so use default
			glob.renderer.setRenderTarget(spotlight!.target);
			glob.renderer.clear();
			glob.renderer.render(scene, camera);
			glob.renderer.setRenderTarget(null);
		}
	}
	// end of stage

	// shapes

	export abstract class shape_base {
		group
		constructor(readonly data: shape_literal) {
			this.group = new THREE.Group();
			this._create();
		}
		protected _create() { }
	}

	class hexagon {
		mesh
		scalar = 8.7
		constructor() {
			this.make();
		}
		make() {
			const { scalar } = this;
			const vertices: number[] = [1 * scalar, 0 * scalar, 0 * scalar, 0.5 * scalar, 0.866 * scalar, 0 * scalar, -0.5 * scalar, 0.866 * scalar, 0 * scalar, -1 * scalar, 0 * scalar, 0 * scalar, -0.5 * scalar, -0.866 * scalar, 0 * scalar, 0.5 * scalar, -0.866 * scalar, 0 * scalar];
			const indices: number[] = [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 1];
			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
			geometry.setIndex(indices);
			const material = new THREE.MeshPhongMaterial({
				// map: pipeline.loadTexture(, 0),
				color: rome.sample(['blue', 'red']),
				// wireframe: true
			});
			this.mesh = new THREE.Mesh(geometry, material);
		}
		get(shape: shape_base) {
			const { data } = shape;
			this.mesh.position.set(0, 0, -7);
			this.mesh.updateMatrix();
			return this.mesh;
		}
	}

	export interface shape_literal {
		// gabeObject: game_object,
		texture: string,
		size: vec3
	}

	export class shape_box extends shape_base {
		constructor(data: shape_literal) {
			super(data);
			this._create();
		}
		protected override _create() {
			const { size } = this.data;
			const box = new THREE.BoxGeometry(size[0], size[1], size[2]);
			const material = new THREE.MeshPhongMaterial({
				// color: 'red',
				map: pipeline.loadTexture(this.data.texture, 0)
			});
			const mesh = new THREE.Mesh(box, material);
			this.group.add(mesh);
			this.group.add(new hexagon().get(this));
			this.group.updateMatrix();
		}
	}

	export type shape_types = 'nothing' | 'wall'

	export function shapeMaker(type: shape_types, data: shape_literal) {
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
}

export default tileform;