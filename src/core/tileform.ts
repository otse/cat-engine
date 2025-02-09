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

	// This doesn't do anything but it's a cool ide
	const tileformSpaceScaling = 10;

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

	export let HexRotationX = 0.6135987755982989;
	export let HexRotationY = 1.045;

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
			const sunDistance = 2;
			sun = new THREE.DirectionalLight('red', Math.PI);
			sun.position.set(-sunDistance / 6, sunDistance / 4, sunDistance);
			// scene.add(new THREE.AxesHelper(50));
			scene.add(sun);
			scene.updateMatrix();
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

		// aka stage
		export function prepare(sprite: sprite3d) {
			scene.scale.set(glob.scale, glob.scale, glob.scale);
			scene.updateMatrix();

			spotlight = sprite;
			let { spriteSize: size } = sprite.data;
			size = (pts.mult(size!, glob.scale));
			camera = new THREE.OrthographicCamera(
				size[0] / - 2,
				size[0] / 2,
				size[1] / 2,
				size[1] / - 2,
				-300, 300);
			// Translate
			const pos = (pts.mult(sprite._3dpos, glob.scale));
			camera.position.set(pos[0], 0, pos[1]);
			camera.updateMatrix();
			while (putGroup.children.length > 0)
				putGroup.remove(putGroup.children[0]);
			putGroup.add(sprite.shape3d!.shapeGroup);
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

	// Arrays that's never used for anything
	// "A useless array"
	const shapes: shape_base[] = []

	export abstract class shape_base {
		shapeGroup
		// _created
		constructor(readonly data: shape_literal) {
			this.data = {
				shapeTexture: './img/textures/stonemixed.jpg',
				shapeHexTexture: './img/textures/beachnormal.jpg',
				...data
			}
			this.shapeGroup = new THREE.Group();
			//this.shapeGroup.add(new THREE.AxesHelper(2));
			//this.shapeGroup.updateMatrix();
			shapes.push(this);
			// this.create(); // Spike
		}
		step() {
			this._step();
		}
		create() {
			this._create();
			// this._created = true;
		}
		delete() {
			this._delete();
		}
		protected _create() {
			console.warn(' empty shape create ');
		}
		protected _delete() {
			console.warn(' empty shape delete ');
		}
		protected _step() { }
	}

	export interface shape_literal {
		gobj: game_object,
		shapeType?: shape_types,
		shapeTexture?: string,
		shapeHexTexture?: string,
		shapeSize?: vec3,
	}

	export class shape_hex_wrapper extends shape_base {
		hexTile: hex_tile
		constructor(data: shape_literal) {
			super(data);
		}
		protected override _create() {
			this.hexTile = new hex_tile(this.data);
			this.shapeGroup.add(this.hexTile.rotationGroup);
			//this.hex.rotationGroup.position.set(0, 0, 0);
			//this.hex.rotationGroup.updateMatrix();
		}
		protected override _delete() {
			this.hexTile.free();
		}
	}

	export let hex_size = 7.7;

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
			const vertices2: number[] = [1, 0, 0, 0.5, 0.866, 0, -0.5, 0.866, 0, -1, 0, 0, -0.5, -0.866, 0, 0.5, -0.866, 0];
			const indices: number[] = [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 1];
			const uvs: number[] = [0.5, 0, 1, 0.5, 0.75, 1, 0.25, 1, 0, 0.5, 0.25, 0, 0.75, 0];
			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
			geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
			geometry.setIndex(indices);
			const material = new THREE.MeshPhongMaterial({
				color: 'white',
				map: pipeline.getTexture(this.data.shapeHexTexture!),
			});
			this.rotationGroup = new THREE.Group();
			this.rotationGroup.rotation.set(HexRotationX, HexRotationY, 0);
			this.mesh = new THREE.Mesh(geometry, material);
			this.mesh.rotation.set(-Math.PI / 2, 0, 0);
			this.mesh.updateMatrix();
			this.rotationGroup.add(this.mesh);
			this.rotationGroup.updateMatrix();
		}
		free() {
			this.mesh.geometry.dispose();
			this.mesh.material.dispose();
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
		wallRotationGroup
		mesh
		constructor(data: shape_literal) {
			super(data);
		}
		protected override _create() {
			const { shapeSize } = this.data;
			const geometry = wallMaker(this);
			const material = new THREE.MeshPhongMaterial({
				// color: this.data.gabeObject.data.colorOverride || 'white',
				// opacity: 0.8,
				transparent: true,
				map: pipeline.getTexture(this.data.shapeTexture!)
			});
			// Make the merged geometries mesh
			this.mesh = new THREE.Mesh(geometry, material);
			this.mesh.position.set(0, shapeSize![1] / 2, 0);
			this.mesh.updateMatrix();
			// Make the base plate
			this.hexTile = new hex_tile(this.data);
			// Set up rotations
			this.wallRotationGroup = new THREE.Group();
			this.wallRotationGroup.add(this.mesh);
			this.shapeGroup.add(this.wallRotationGroup);
			this.shapeGroup.add(this.hexTile.rotationGroup);
			// Translate the shape group so we can take lighting sources
			const { wpos } = this.data.gobj;
			const projected = (pts.mult(pts.project(wpos), tileformSpaceScaling));
			(this.data.gobj.sprite as sprite3d)._3dpos = projected;
			// Translate
			this.shapeGroup.position.set(projected[0], 0, projected[1]);
			this.shapeGroup.updateMatrix();
			//this.hexTile.rotationGroup.position.set(0, 0, 0);
			//this.hexTile.rotationGroup.updateMatrix();
			this._step();
		}
		protected free() {
			this.mesh.geometry.dispose();
			this.mesh.material.dispose();
		}
		protected override _delete() {
			this.hexTile.free();
			this.free();
		}
		protected override _step() {
			this.wallRotationGroup.rotation.set(Math.PI / wallRotationX, Math.PI / wallRotationY, 0);
			this.wallRotationGroup.updateMatrix();
			this.shapeGroup.updateMatrix();
		}
	}

	function wallMaker(wall: shape_wall) {
		let { shapeSize } = wall.data;
		const size = shapeSize!;
		const geometries: any[] = [];
		// Hack!
		const directionAdapter = (wall.data.gobj as any).directionAdapter as direction_adapter;
		//console.log('shape wall create!', directionAdapter.directions);
		if (!directionAdapter) {
			console.warn(' no direction adapter for wallmaker');
			return;
		}
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
			directionAdapter.directions.includes('south') ||
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
		if (!geometries.length)
			return;
		const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
		return mergedGeometry;
	}

	export class shape_light extends shape_base {
		light
		constructor(data: shape_literal) {
			super(data);
		}
		protected override _create() {
		}
	}
}

export default tileform;