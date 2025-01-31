/// This poorly named component turns basic 3d shapes into sprites

import app from "../app.js";
import glob from "../dep/glob.js";
import { hooks } from "../dep/hooks.js";
import pts from "../dep/pts.js";
import rome from "../rome.js";
import direction_adapter from "./direction adapter.js";
import game_object from "./objects/game object.js";
import pipeline from "./pipeline.js";
import sprite3d from "./sprite 3d.js";
import sprite from "./sprite.js";

namespace tileform {

	export type scene_preset = 'hex' | 'wall'

	export async function init() {
		await stage.init();
		hooks.addListener('romeComponents', step);
		return;
	}

	async function step() {
		stage.step();
		return false;
	}

	export namespace stage {
		export let scene, putGroup, camera, renderer, ambient, sun
		export let spotlight: sprite3d | undefined
	}

	const GreatRotationX = Math.PI / 6;
	const GreatRotationY = Math.PI / Math.PI;

	let wallRotationX = 9;
	let wallRotationY = 4;

	export namespace stage {

		export function step() {
			let change = false;
			if (app.key('o') == 1) {
				wallRotationX -= 1;
				change = true;
			}
			if (app.key('p') == 1) {
				wallRotationX += 1;
				change = true;
			}
			if (app.key('k') == 1) {
				wallRotationY -= 1;
				change = true;
			}
			if (app.key('l') == 1) {
				wallRotationY += 1;
				change = true;
			}
			if (!change)
				return;
			glob.rerender = true;
			console.log(wallRotationX, wallRotationY);
			//scene.rotation.set(Math.PI / rotationX, Math.PI / rotationY, 0);
			//scene.updateMatrix();
		}

		export async function init() {
			await preload();
			await boot();
		}

		async function preload() {
			await pipeline.preloadTextureAsync('./img/textures/stonemixed.jpg');
			await pipeline.preloadTextureAsync('./img/textures/beach.jpg');
			await pipeline.preloadTextureAsync('./img/textures/beachnormal.jpg');
			await pipeline.preloadTextureAsync('./img/textures/sand.jpg');
			//await pipeline.loadTextureAsync('./img/textures/sandnormal.jpg');
			await pipeline.preloadTextureAsync('./img/textures/oop.jpg');
			await pipeline.preloadTextureAsync('./img/textures/cobblestone.jpg');
			await pipeline.preloadTextureAsync('./img/textures/cobblestone2.jpg');
			await pipeline.preloadTextureAsync('./img/textures/basaltcliffs.jpg');
			await pipeline.preloadTextureAsync('./img/textures/cliffs.jpg');
			await pipeline.preloadTextureAsync('./img/textures/overgrown.jpg');
			//await pipeline.loadTextureAsync('./img/textures/bricks.jpg');
		}

		async function boot() {
			scene = new THREE.Scene();
			// scene.background = new THREE.Color('purple');
			//scene.rotation.set(GreatRotationX, GreatRotationY, 0);
			camera = new THREE.OrthographicCamera(100 / - 2, 100 / 2, 100 / 2, 100 / - 2, -100, 100);
			putGroup = new THREE.Group();
			//defaultRotation.rotation.set(-Math.PI / 2, 0, 0);
			putGroup.updateMatrix();
			scene.add(putGroup);
			scene.updateMatrix();
			ambient = new THREE.AmbientLight('white', Math.PI / 1);
			scene.add(ambient);
			const sunDistance = 100;
			sun = new THREE.DirectionalLight('red', 1);
			sun.position.set(-sunDistance, -sunDistance / 3, -sunDistance);
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

		function set_preset(scenePreset: scene_preset) {
			switch (scenePreset) {
				case 'hex':
					//majorGroup.rotation.set(Math.PI / 6, Math.PI / Math.PI, 0);
					break;
				case 'wall':
					//majorGroup.rotation.set(Math.PI / 6, 1, 0);
					break;
			}
			//majorGroup.updateMatrix();
		}

		export function prepare(sprite: sprite3d) {
			set_preset(sprite.data_._scenePresetDepr);
			spotlight = sprite;
			let { size } = sprite.data;
			size = pts.mult(size!, glob.scale);
			camera = new THREE.OrthographicCamera(
				size[0] / - 2,
				size[0] / 2,
				size[1] / 2,
				size[1] / - 2,
				-100, 100);
			while (putGroup.children.length > 0)
				putGroup.remove(putGroup.children[0]);
			putGroup.add(sprite.shape3d!.group);
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

	const shapes: shape_base[] = []

	export abstract class shape_base {
		group
		_created
		constructor(readonly data: shape_literal) {
			this.data = {
				texture: './img/textures/stonemixed.jpg',
				hexTexture: './img/textures/beach.jpg',
				...data
			}
			this.group = new THREE.Group();
			this.group.scale.set(glob.scale, glob.scale, glob.scale);
			this.group.updateMatrix();
			shapes.push(this);
			// this.create(); // Spike
		}
		step() {
			this._step();
		}
		create() {
			this._create();
			this._created = true;
		}
		protected _create() {
			console.warn(' empty shape create ');
		}
		protected _step() { }
	}

	export interface shape_literal {
		gobj: game_object,
		type: shape_modifiers,
		texture?: string,
		hexTexture?: string,
		size: vec3,
	}

	export class shape_hex_wrapper extends shape_base {
		hex: hex_tile
		constructor(data: shape_literal) {
			super(data);
		}
		protected override _create() {
			this.hex = new hex_tile(this.data);
			this.group.add(this.hex.rotationGroup);
			this.hex.rotationGroup.position.set(0, 0, 0);
			this.hex.rotationGroup.updateMatrix();
		}
	}

	export let hex_size = 8;

	class hex_tile {
		scalar = 8
		rotationGroup
		protected mesh
		constructor(readonly data: shape_literal) {
			this.scalar = hex_size;
			this.make();
		}
		make() {
			const { scalar } = this;
			const vertices: number[] = [1 * scalar, 0 * scalar, 0 * scalar, 0.5 * scalar, 0.866 * scalar, 0 * scalar, -0.5 * scalar, 0.866 * scalar, 0 * scalar, -1 * scalar, 0 * scalar, 0 * scalar, -0.5 * scalar, -0.866 * scalar, 0 * scalar, 0.5 * scalar, -0.866 * scalar, 0 * scalar];
			const indices: number[] = [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 1];
			const uvs: number[] = [0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1];
			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
			geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
			geometry.setIndex(indices);
			const material = new THREE.MeshPhongMaterial({
				color: 'white',
				map: pipeline.getTexture(this.data.hexTexture!),
			});
			this.rotationGroup = new THREE.Group();
			this.rotationGroup.rotation.set(GreatRotationX, GreatRotationY, 0);
			this.mesh = new THREE.Mesh(geometry, material);
			this.mesh.rotation.set(-Math.PI / 2, 0, 0);
			this.mesh.updateMatrix();
			this.rotationGroup.add(this.mesh);
			this.rotationGroup.updateMatrix();
		}
	}

	export type shape_types = 'nothing' | 'wall' | 'hex'

	export type shape_modifiers = 'regular' | 'concave' | 'convex' | 'north' | 'east' | 'south' | 'west'

	export function shapeMaker(type: shape_types, data: shape_literal) {
		let shape: shape_base | undefined;
		switch (type) {
			case 'nothing':
				console.warn(' no shape type passed to factory ');
				break;
			case 'wall':
				shape = new shape_wall(data);
				break;
			case 'hex':
				shape = new shape_hex_wrapper(data);
				break;
		}
		return shape;
	}

	// boring wall geometries

	export class shape_wall extends shape_base {
		hexTile: hex_tile
		rotationGroup
		constructor(data: shape_literal) {
			super(data);
		}
		protected override _create() {
			
			const geometry = wallMaker(this);
			const material = new THREE.MeshPhongMaterial({
				// color: this.data.gabeObject.data.colorOverride || 'white',
				opacity: 1,
				transparent: true,
				map: pipeline.getTexture(this.data.texture!)
			});
			const mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(0, -6, 0);
			mesh.updateMatrix();
			this.hexTile = new hex_tile(this.data);
			this.rotationGroup = new THREE.Group();
			this.rotationGroup.add(mesh);
			this.group.add(this.hexTile.rotationGroup);
			this.hexTile.rotationGroup.position.set(0, -13, 0);
			this.hexTile.rotationGroup.updateMatrix();
			this.group.add(this.rotationGroup);
			this.group.updateMatrix();
			this._step();
		}
		protected override _step() {
			this.rotationGroup.rotation.set(Math.PI / wallRotationX, Math.PI / wallRotationY, 0);
			this.rotationGroup.updateMatrix();
			this.group.updateMatrix();
		}
	}

	function wallMaker(wall: shape_wall) {
		const { size } = wall.data;
		const geometries: any[] = [];
		// Hack!
		const directionAdapter = (wall.data.gobj as any).directionAdapter as direction_adapter;
		//console.log('shape wall create!', directionAdapter.directions);

		if (!directionAdapter) {
			console.warn(' no direction adapter for wallmaker');
			
			return;
		}
		switch (wall.data.type) {
			case 'concave':

				break;
			case 'regular':
				let geometry;
				if (directionAdapter.directions.includes('north')) {
					geometry = new THREE.BoxGeometry(size[0] / 2, size[1], size[2] / 2);
					geometry.translate(size[0] / 4, 0, size[2] / 4);
					geometries.push(geometry);
				}
				if (directionAdapter.directions.includes('east')) {
					geometry = new THREE.BoxGeometry(size[0] / 2, size[1], size[2] / 2);
					geometry.translate(-size[0] / 4, 0, size[2] / 4);
					geometries.push(geometry);
				}
				if (directionAdapter.directions.includes('south')) {
					geometry = new THREE.BoxGeometry(size[0] / 2, size[1], size[2] / 2);
					geometry.translate(-size[0] / 4, 0, size[2] / 4);
					geometries.push(geometry);
				}
				if (directionAdapter.directions.includes('west')) {
					geometry = new THREE.BoxGeometry(size[0] / 2, size[1], size[2] / 2);
					geometry.translate(-size[0] / 4, 0, -size[2] / 4);
					geometries.push(geometry);
				}
				if (directionAdapter.directions.includes('north') &&
					directionAdapter.directions.includes('aest') ||
					directionAdapter.directions.includes('east') &&
					directionAdapter.directions.includes('south')||
					directionAdapter.directions.includes('south') &&
					directionAdapter.directions.includes('west') ||
					directionAdapter.directions.includes('west') &&
					directionAdapter.directions.includes('north')
				) {
					// Middle piece!
					geometry = new THREE.BoxGeometry(size[0] / 2, size[1], size[2] / 2);
					geometry.translate(-size[0] / 4, 0, size[2] / 4);
					geometries.push(geometry);
				}
				break;
		}
		if (!geometries.length)
			return;
		const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
		return mergedGeometry;
	}
}

export default tileform;