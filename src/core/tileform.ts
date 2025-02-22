/// This poorly named component turns basic 3d shapes into sprites

import app from "../app.js";
import glob from "../dep/glob.js";
import { hooks } from "../dep/hooks.js";
import pts from "../dep/pts.js";
import rome from "../rome.js";
import pan from "./components/pan.js";
import direction_adapter from "./direction adapter.js";
import game_object from "./objects/game object.js";
import pipeline from "./pipeline.js";
import sprite3d from "./sprite 3d.js";
import sprite from "./sprite.js";

namespace tileform {

	// this switch was going to make lighting "more perspective"
	// the idea was NOT simple:
	// right now, light is uniform and the camera sits right on top of the tile
	// this switch was going to make the the camera sit in the middle of the view
	// (where it should be, so not on top of a tile like default)
	// then change the scene offset so the viewport centers on the tile
	// with this change, lighting should reflect more realistically
	// yes, lights will offset along with the scene
	// in short this change should make lighting appear
	// more 3d on the horizontal as well not just on the vertical
	export const lightingModeUniform = true;

	// using some fidgety math based entirely on trial and error
	// i managed to create a sun that doesn't render uniformly
	// setting this is nice but requires reprerenders 
	export const nonUniformSun = true;

	// this switch enables lights to "act more 3d"
	// by raising them when they're further from the camera
	// will require reprerenders every frame
	export const lyftLightSourcesFromCamera = true;

	export let ALLOW_NORMAL_MAPS = true;

	export type scene_preset = 'hex' | 'wall'

	// This doesn't do anything but it's a cool ide
	const StretchSpace = 1;

	export async function init() {
		await stage.init();
		hooks.addListener('romeComponents', step);
		return;
	}

	async function step() {
		stage.step();
		update_entities();
		return false;
	}

	function update_entities() {
		// Updating is different from object-stepping
		for (const entity of entities) {
			entity.update();
		}
	}

	// Light sources seem to scatter towards the south east
	// May be this functions fault
	function project(w: vec2): vec2 {
		const tileWidth = glob.hexSize[0];
		const tileHeight = glob.hexSize[0];
		const x = w[0];
		const y = -w[1];
		const scaleFactor = tileWidth * 0.75;
		return [
			(x - y) * ((scaleFactor)),
			(x + y) * ((-tileHeight) / 2)
		];
	}

	export namespace stage {
		export let scene, soleGroup, lightsGroup, camera, stageRenderer, ambient, sun
		export let spotlight: sprite3d | undefined
	}

	export let HexRotationX = 0.6135987755982989;
	export let HexRotationY = 1.045;

	let stageCameraRotation = 0.9471975511965977;

	let wallRotationX = -1;
	let wallRotationY = 6;

	export namespace stage {

		export function step() {
			opkl();
			// Testing new lighting mode
			glob.rerender = true;
			glob.rerenderObjects = true;
		}

		export async function init() {
			await preload();
			await boot();
		}

		async function preload() {
			await pipeline.preloadTextureAsync('./img/textures/stonemixed.jpg');
			await pipeline.preloadTextureAsync('./img/textures/stonemixednormal.jpg');
			await pipeline.preloadTextureAsync('./img/textures/stonemixed2.jpg');
			await pipeline.preloadTextureAsync('./img/textures/stonemixed2normal.jpg');
			await pipeline.preloadTextureAsync('./img/textures/cobblestone3.jpg');
			await pipeline.preloadTextureAsync('./img/textures/cobblestone3normal.jpg');
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
			//const testLight = new THREE.PointLight('red', 100000, 0);
			//testLight.distance = 0;
			//testLight.position.set(0, 100, 0);
			//const helper = new THREE.PointLightHelper(testLight, 30);
			scene = new THREE.Scene();
			// scene.fog = new THREE.Fog( 0xcccccc, 0, 5 );
			scene.matrixWorldAutoUpdate = true;
			//scene.add(testLight);
			//scene.add(helper);
			// scene.background = new THREE.Color('purple');
			camera = new THREE.OrthographicCamera(100 / - 2, 100 / 2, 100 / 2, 100 / - 2, -100, 100);
			soleGroup = new THREE.Group();
			//soleGroup.rotation.y = Math.PI / 2;
			lightsGroup = new THREE.Group();
			scene.add(soleGroup);
			scene.add(lightsGroup);
			scene.updateMatrix();
			ambient = new THREE.AmbientLight('white', Math.PI / 2);
			scene.add(ambient);
			sun = new THREE.DirectionalLight('white', Math.PI / 8);
			const sunDistance = 20;
			sun.position.set(-sunDistance / 6, sunDistance / 4, sunDistance);
			sun.updateMatrix();
			scene.add(new THREE.AxesHelper(5));
			scene.add(sun.target);
			scene.add(sun);

			scene.add(camera);
			scene.updateMatrix();
			// todo create a second renderer that has shadows enabled

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
			camera.position.set(0, 0, 0);
			camera.rotation.set(stageCameraRotation, 0, 0);
			if (nonUniformSun) {
				// Random math to handle 3d sunlight
				const pos3d = (pts.mult(sprite.shape!.pos3d, glob.scale));
				const sunDistance = 20;
				let offset = (pts.subtract(pan.rpos, pos3d));
				sun.position.set(offset[0], offset[1], sunDistance);
				sun.target.position.set(0, -pan.rpos[1], 0);
				sun.updateMatrix();
				sun.target.updateMatrix();
			}
			if (lightingModeUniform) {
				const pos3d = (pts.mult(sprite.shape!.pos3d, glob.scale));
				camera.position.set(pos3d[0], pos3d[1], 0);
				camera.updateMatrix();
			}
			else {
				// 3d lighting mode "experimental"
				camera.position.set(pan.rpos[0], pan.rpos[1], 0);
				camera.updateMatrix();
				const pos3d = pts.copy(sprite.shape!.pos3d);
				let offset = (pts.subtract(pan.rpos, pos3d));
				scene.position.set(offset[0], offset[1], 0);
				scene.updateMatrix()
			}
			while (soleGroup.children.length > 0)
				soleGroup.remove(soleGroup.children[0]);
			soleGroup.add(sprite.shape!.entityGroup);
			soleGroup.updateMatrix();
			scene.updateMatrix();
			scene.updateMatrixWorld(true);
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

	const shapes: shape3d[] = []
	const entities: entity3d[] = []

	abstract class entity3d {
		entityGroup
		pos3d: vec2 = [0, 0]
		constructor(readonly gobj: game_object) {
			this.entityGroup = new THREE.Group();
			entities.push(this);
		}
		create() {
			this._create();
		}
		delete() {
			this.free();
			this._delete();
		}
		step() {
			this._step();
		}
		update() {
			this._update();
		}
		private free() {
			const index = entities.indexOf(this);
			if (index !== -1) {
				entities.splice(index, 1);
			}
		}
		protected _create() {
			console.warn('empty entity create');
		}
		protected _delete() {
			console.warn('empty entity delete');
		}
		protected _step() {
		}
		protected _update() {
		}
		protected translate() {
			// Useful for beautiful lighting
			const { wpos } = this.gobj;
			const pos = this.pos3d = (pts.mult(project(wpos), StretchSpace));
			this.entityGroup.position.fromArray([...pos, 0]);
			this.entityGroup.updateMatrix();
		}
	}

	export abstract class shape3d extends entity3d {
		constructor(readonly data: shape_literal) {
			super(data.gobj);
			this.data = {
				shapeTexture: './img/textures/stonemixed.jpg',
				shapeGroundTexture: './img/textures/beachnormal.jpg',
				shapeGroundTextureNormal: './img/textures/beachnormal.jpg',
				...data
			}
		}
	}

	export namespace shape3d {
		export type literal = shape3d['data'];
	};

	export interface shape_literal {
		gobj: game_object,
		shapeType?: shape_types,
		shapeTexture?: string,
		shapeGroundTextureNormal?: string,
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
			this.entityGroup.add(this.hexTile.group);
			// this.entityGroup.add(new THREE.AxesHelper(8));
			this.translate();
		}
		protected override _delete() {
			this.hexTile.free();
		}
	}

	export let hex_size = 7.9;

	class hex_tile {
		scalar
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
				specular: 'white',
				shininess: 10,
				map: pipeline.getTexture(this.data.shapeGroundTexture!),
				normalScale: new THREE.Vector2(1, 1),
				normalMap: ALLOW_NORMAL_MAPS ? pipeline.getTexture(this.data.shapeGroundTextureNormal!) : null,
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
			const geometry = wallMaker(this);
			//const geometry = new THREE.SphereGeometry(8, 8, 8);
			const material = new THREE.MeshPhongMaterial({
				// color: this.data.gabeObject.data.colorOverride || 'white',
				// opacity: 0.8,
				transparent: true,
				map: pipeline.getTexture(this.data.shapeTexture!)
			});
			// Make the merged geometries mesh
			const { shapeSize } = this.data;
			this.mesh = new THREE.Mesh(geometry, material);
			this.mesh.updateMatrix();
			// Make the base plate
			this.hexTile = new hex_tile(this.data);
			// Set up rotations
			this.wallRotationGroup = new THREE.Group();
			this.wallRotationGroup.add(this.mesh);
			this.wallRotationGroup.position.z = shapeSize![2];
			this.entityGroup.add(this.wallRotationGroup);
			this.entityGroup.add(this.hexTile.group);
			// Translate so we can take lighting sources
			this.translate();
			//this.hexTile.rotationGroup.position.set(0, 0, 0);
			//this.hexTile.rotationGroup.updateMatrix();
			this._step();
		}
		protected dispose() {
			this.mesh.geometry.dispose();
			this.mesh.material.dispose();
		}
		protected override _delete() {
			this.dispose();
			this.hexTile.free();
		}
		protected override _step() {
			this.wallRotationGroup.rotation.set(0, 0, Math.PI / wallRotationY);
			this.wallRotationGroup.updateMatrix();
			this.entityGroup.updateMatrix();
		}
	}

	function wallMaker(wall: shape_wall) {
		let { shapeSize } = wall.data;
		const size = shapeSize!;
		const geometries: any[] = [];
		// Hack!
		const da = (wall.data.gobj as any).directionAdapter as direction_adapter;
		//console.log('shape wall create!', directionAdapter.directions);
		if (!da) {
			console.warn(' no direction adapter for wallmaker');
			return;
		}
		let geometry;
		if (da.has_direction('north')) {
			geometry = new THREE.BoxGeometry(size[0] / 2, size[1] / 2, size[2]);
			geometry.translate(size[0] / 4, size[1] / 4, 0);
			geometries.push(geometry);
		}
		if (da.has_direction('east')) {
			geometry = new THREE.BoxGeometry(size[0] / 2, size[1] / 2, size[2]);
			geometry.translate(-size[0] / 4, size[1] / 4, 0);
			geometries.push(geometry);
		}
		if (da.has_direction('south')) {
			geometry = new THREE.BoxGeometry(size[0] / 2, size[1] / 2, size[2]);
			geometry.translate(-size[0] / 4, size[1] / 4, 0);
			geometries.push(geometry);
		}
		if (da.has_direction('west')) {
			geometry = new THREE.BoxGeometry(size[0] / 2, size[1] / 2, size[2]);
			geometry.translate(-size[0] / 4, -size[1] / 4, 0);
			geometries.push(geometry);
		}
		if (da.has_direction('north') &&
			da.has_direction('aest') ||
			da.has_direction('east') &&
			da.has_direction('south') ||
			da.has_direction('south') &&
			da.has_direction('west') ||
			da.has_direction('west') &&
			da.has_direction('north')
		) {
			// Middle piece!
			geometry = new THREE.BoxGeometry(size[0] / 2, size[1] / 2, size[2]);
			geometry.translate(-size[0] / 4, size[1] / 4, 0);
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
		wpos2
		light
		constructor(readonly data: light_source_literal) {
			super(data.gobj);
			this.data = {
				radiance: 60,
				...data
			}
			this.wpos2 = pts.copy(this.gobj.wpos);
		}
		step() {
			this._step();
		}
		lyft(pos: vec2) {
			// Experimental
			this.entityGroup.position.z += 1;
		}
		protected override _step() {
		}
		protected override _update() {
			// Dance the light source
			glob.rerender = true;
			glob.rerenderObjects = true;
			//return;
			this.light.position.x = 4;
			this.light.updateMatrix();
			const secondsPerRotation = 4;
			this.entityGroup.rotation.z += (Math.PI * 2) * (1 / secondsPerRotation * glob.delta);
			//this.entityGroup.position.x += glob.delta;
			this.entityGroup.updateMatrix();
			this.light.updateMatrix();
			glob.rerender = true;
			glob.rerenderObjects = true;
		}
		protected override _delete() {
			console.log('remove light');
			stage.lightsGroup.remove(this.entityGroup);
		}
		protected override _create() {
			console.log(' tf light source create ');
			this.light = new THREE.PointLight('cyan', 1, 5);
			// this.light.decay = 2.4;
			this.light.intensity = 10000 * glob.scale;
			this.light.distance = 600 * glob.scale;
			this.light.decay = 1.8;
			this.light.updateMatrix();
			this.entityGroup.add(this.light);
			// Translate
			this.translate();
			this.entityGroup.position.z = 10;
			this.entityGroup.updateMatrix();
			// this.entityGroup.updateMatrixWorld(true); // Bad
			stage.lightsGroup.add(this.entityGroup);
		}
	}

	function opkl() {
		let change = false;
		if (app.key('f3') == 1) {
			ALLOW_NORMAL_MAPS = !ALLOW_NORMAL_MAPS;
		}
		else if (app.key('o') == 1) {
			wallRotationX -= 1;
		}
		else if (app.key('p') == 1) {
			wallRotationX += 1;
		}
		else if (app.key('k') == 1) {
			wallRotationY -= 1;
		}
		else if (app.key('l') == 1) {
			wallRotationY += 1;
		}
		else if (app.key('v') == 1) {
			if (stageCameraRotation > 0)
				stageCameraRotation -= .1;
		}
		else if (app.key('b') == 1) {
			stageCameraRotation += .1;
		}
		else {
			return;
		}
		glob.rerender = true;
		rome.purgeRemake();
		console.log(wallRotationX, wallRotationY);
		console.log("stageCameraRotation", stageCameraRotation);
	}
}

export default tileform;