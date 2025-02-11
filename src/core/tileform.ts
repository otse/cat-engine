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
	const tfStretchSpace = 1;

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
		export let scene, soleGroup, lightsGroup, camera, stageRenderer, ambient, sun
		export let spotlight: sprite3d | undefined
	}

	export let HexRotationX = 0.6135987755982989;
	export let HexRotationY = 1.045;

	let stageCameraRotation = Math.PI / 3;

	let wallRotationX = 9;
	let wallRotationY = 4;

	export namespace stage {

		export function step() {
			opkl();
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
			const testLight = new THREE.PointLight('red', 100000, 0);
			testLight.distance = 0;
			testLight.position.set(0, 100, 0);
			const helper = new THREE.PointLightHelper(testLight, 30);
			scene = new THREE.Scene();
			scene.matrixWorldAutoUpdate = true;
			//scene.add(testLight);
			//scene.add(helper);
			// scene.background = new THREE.Color('purple');
			camera = new THREE.OrthographicCamera(100 / - 2, 100 / 2, 100 / 2, 100 / - 2, -100, 100);
			soleGroup = new THREE.Group();
			lightsGroup = new THREE.Group();
			scene.add(soleGroup);
			scene.add(lightsGroup);
			scene.updateMatrix();
			ambient = new THREE.AmbientLight('white', 1);
			scene.add(ambient);
			const sunDistance = 2;
			sun = new THREE.DirectionalLight('yellow', Math.PI / 3);
			sun.position.set(-sunDistance / 6, sunDistance / 4, sunDistance);
			scene.add(new THREE.AxesHelper(5));
			scene.add(sun);

			scene.add(camera);
			scene.updateMatrix();
		}

		// aka stage
		export function prepare(sprite: sprite3d) {
			scene.scale.set(glob.scale, glob.scale, glob.scale);
			//scene.updateMatrix();
			//scene.updateMatrixWorld(true); // Wonky
			spotlight = sprite;
			let { spriteSize: size } = sprite.data;
			size = (pts.mult(size!, glob.scale));
			camera = new THREE.OrthographicCamera(
				size[0] / - 2,
				size[0] / 2,
				size[1] / 2,
				size[1] / - 2,
				-100, 500);
			camera.position.set(0, 1, 0); // Point the camera down at a dimetric rotation
			camera.rotation.set(stageCameraRotation, 0, 0); // Dimetric rotation
			// scene.add(camera);
			// camera.position.y = 20 * glob.scale;
			// Translate
			const pos = (pts.mult(sprite.shape3d!.pos3d, glob.scale));
			camera.position.set(pos[0], pos[1], 0);
			//camera.updateMatrix();
			while (soleGroup.children.length > 0)
				soleGroup.remove(soleGroup.children[0]);
			//soleGroup.add(lightsGroup);
			soleGroup.add(sprite.shape3d!.group);
			/*const { wpos } = sprite.gobj;
			const projected = (pts.mult(pts.project(wpos), tfMultiplier));
			soleGroup.position.set(projected[0], 0, projected[1]);*/
		}

		export function render() {
			// Todo: stage renderer doesn't render anything so use default
			glob.renderer.setRenderTarget(spotlight!.target);
			glob.renderer.clear();
			glob.renderer.render(scene, camera);
			glob.renderer.setRenderTarget(null);
			// console.log("Lights:", scene.children.filter(obj => obj.isLight));
		}
	}
	// end of stage

	// shapes

	// Unused array
	const shapes: shape3d[] = []

	abstract class entity3d {
		group
		pos3d: vec2 = [0, 0]
		constructor(readonly gobj: game_object) {
			this.group = new THREE.Group();
		}
		protected translate() {
			// Translate so we can take lighting sources
			const { wpos } = this.gobj;
			
			this.pos3d = (pts.mult(pts.project(wpos), tfStretchSpace));
			const temp = pts.copy(this.pos3d);
			this.pos3d = [temp[0], temp[1]];
			this.group.position.set(this.pos3d[0], this.pos3d[1], 0);
		}
	}

	export abstract class shape3d extends entity3d {
		// _created
		constructor(readonly data: shape_literal) {
			super(data.gobj);
			this.data = {
				shapeTexture: './img/textures/stonemixed.jpg',
				shapeGroundTexture: './img/textures/beachnormal.jpg',
				...data
			}
			shapes.push(this);
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

	export namespace shape3d {
		export type literal = shape3d['data'];
	};

	export interface shape_literal {
		gobj: game_object,
		shapeType?: shape_types,
		shapeTexture?: string,
		shapeGroundTexture?: string,
		shapeSize?: vec3,
	}

	export class shape_hex_wrapper extends shape3d {
		hexTile: hex_tile
		constructor(data: shape_literal) {
			super(data);
		}
		protected override _create() {
			this.hexTile = new hex_tile(this.data);
			this.group.add(this.hexTile.group);
			this.group.add(new THREE.AxesHelper(5));
			this.translate();
			// this.shapeGroup.updateMatrix();
		}
		protected override _delete() {
			this.hexTile.free();
		}
	}

	export let hex_size = 7.7;

	class hex_tile {
		scalar = 8
		group
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
			let geometry = new THREE.BufferGeometry();
			geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
			geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
			geometry.setIndex(indices);
			const normals: number[] = [];
			for (let i = 0; i < indices.length; i += 3) {
				// Define a flat normal pointing up (0, 1, 0) for each vertex in a face
				normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
			}
			geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
			const material = new THREE.MeshPhongMaterial({
				color: 'white',
				shininess: 0,
				map: pipeline.getTexture(this.data.shapeGroundTexture!),
				// side: THREE.DoubleSide
			});
			// geometry = new THREE.PlaneGeometry(10, 10);
			// Now do the grouping
			this.group = new THREE.Group();
			// this.group.rotation.set(HexRotationX, HexRotationY, 0);
			this.mesh = new THREE.Mesh(geometry, material);
			this.group.add(this.mesh);
		}
		free() {
			this.mesh.geometry.dispose();
			this.mesh.material.dispose();
		}
	}

	export type shape_types = 'nothing' | 'wall' | 'hex'

	export type shape_modifiers = 'regular' | 'concave' | 'convex' | 'north' | 'east' | 'south' | 'west'

	export function shapeMaker(type: shape_types, data: shape_literal) {
		let shape: shape3d | undefined;
		switch (type) {
			case 'nothing':
				console.warn(' no shape type passed to factory ');
				break;
			case 'hex':
				shape = new shape_hex_wrapper(data);
				break;
			case 'wall':
				shape = new shape_wall(data);
				break;
		}
		return shape;
	}

	// boring wall geometries

	export class shape_wall extends shape3d {
		hexTile: hex_tile
		wallRotationGroup
		mesh
		constructor(data: shape_literal) {
			super(data);
		}
		protected override _create() {
			//const geometry = wallMaker(this);
			const geometry = new THREE.SphereGeometry(8, 8, 8);
			const material = new THREE.MeshPhongMaterial({
				// color: this.data.gabeObject.data.colorOverride || 'white',
				// opacity: 0.8,
				transparent: true,
				map: pipeline.getTexture(this.data.shapeTexture!)
			});
			// Make the merged geometries mesh
			const { shapeSize } = this.data;
			this.mesh = new THREE.Mesh(geometry, material);
			this.mesh.position.set(0, shapeSize![1], 0);
			this.mesh.updateMatrix();
			// Make the base plate
			this.hexTile = new hex_tile(this.data);
			// Set up rotations
			this.wallRotationGroup = new THREE.Group();
			this.wallRotationGroup.add(this.mesh);
			this.group.add(this.wallRotationGroup);
			this.group.add(this.hexTile.group);
			// Translate so we can take lighting sources
			this.translate();
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
			//this.wallRotationGroup.rotation.set(Math.PI / wallRotationX, Math.PI / wallRotationY, 0);
			//this.wallRotationGroup.updateMatrix();
			this.group.updateMatrix();
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

	export class shape_light_bad_idea extends shape3d {
		light
		constructor(data: shape_literal) {
			super(data);
		}
		protected override _create() {
		}
	}

	export interface light_source_literal {
		gobj: game_object,
		radiance?: number
	}

	export class light_source extends entity3d {
		light
		constructor(readonly data: light_source_literal) {
			super(data.gobj);
			this.data = {
				radiance: 60,
				...data
			}
		}
		create() {
			this._create();
		}
		delete() {
			this._delete();
		}
		update() {
			this._update();
		}
		protected _create() {
			console.log(' tf light source create ');
			this.light = new THREE.PointLight('cyan', 30, 0);
			this.light.decay = 2.4;
			this.group.add(this.light);
			// Translate
			this.translate();
			this.group.position.z = 10;
			stage.lightsGroup.add(this.group);
			//this.light.updateMatrixWorld();
		}
		protected _delete() {
			console.log('remove light');
			// Todo there's a crash here without qm
			this.group.parent?.remove(this.group);
		}
		protected _update() {
			this.light.intensity *= 2000 / stage.scene.scale.x;
		}
	}

	function opkl() {
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
		if (app.key('v') == 1) {
			if (stageCameraRotation > 0)
				stageCameraRotation -= .1;
			change = true;
		}
		if (app.key('b') == 1) {
			stageCameraRotation += .1;
			change = true;
		}
		if (!change)
			return;
		glob.rerender = true;
		rome.purgeRemake();
		console.log(wallRotationX, wallRotationY);
		console.log("stageCameraRotation", stageCameraRotation);
		//scene.rotation.set(Math.PI / rotationX, Math.PI / rotationY, 0);
		//scene.updateMatrix();
	}
}

export default tileform;