/// This poorly named component turns basic 3d shapes into sprites

import app from "../app.js";
import glob from "./../dep/glob.js";
import { hooks } from "../dep/hooks.js";
import pts from "../dep/pts.js";
import rome from "../rome.js";
import pan from "./components/pan.js";
import direction_adapter from "./direction adapter.js";
import game_object from "./objects/game object.js";
import wall3d from "./objects/wall 3d.js";
import pipeline from "./pipeline.js";
import object3d from "./object 3d.js";
import sprite from "./sprite.js";
import staggered_area from "./staggered area.js";
import clod from "./clod.js";

namespace tileform {


	// like it says this toggles the beau ti ful relief maps
	export let TOGGLE_NORMAL_MAPS = true;

	// once i realized the projection function pretended that tiles were dimetric
	// but could be uniform hexagons, this only sets the stage camera to top down,
	// then sets the global hex size to equal width and height
	export var TOGGLE_TOP_DOWN_MODE = false;

	// beautiful red green blues
	export var TOGGLE_RENDER_AXES = false;

	const wallRotation = Math.PI / 6;
	const wallRotationStaggered = Math.PI / 6;

	export async function init() {
		await stage.init();
		hooks.addListener('romeComponents', step);

		glob.wallrotation = wallRotation;
		glob.wallrotationstaggered = wallRotationStaggered;

		make_pan_compressor_line();
		//hooks.addListener('chunkShow', chunkShow);

		return;
	}

	export function purge() {
		make_pan_compressor_line();
		pipeline.utilEraseChildren(pipeline.groups.monolith);
	}

	let tfCompressor;

	function make_pan_compressor_line() {
		// Create a simple geometry with two points
		const geometry = new THREE.BufferGeometry();
		const vertices = new Float32Array([
			0, 0, 0,
			0, 1, 0
		]);
		geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

		// Create a line material
		const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

		// Create the line
		const line = new THREE.Line(geometry, material);
		tfCompressor = line;

		// Add to scene
		// pipeline.scene.add(line);
	}

	function get_compressor_distance() {
		const screenCoords = getVerticalScreenDifference(
			tfCompressor.geometry, tfCompressor, pipeline.camera, pipeline.renderer);
		glob.pancompress = -1 / screenCoords.y;
	}

	function worldToScreen(vertex, camera, renderer) {
		const vector = vertex.clone().project(camera); // Project to NDC space

		// Convert NDC to screen coordinates
		const halfWidth = renderer.domElement.width / 2;
		const halfHeight = renderer.domElement.height / 2;

		return new THREE.Vector2(
			(vector.x * halfWidth) + halfWidth,
			(-vector.y * halfHeight) + halfHeight // Flip Y for screen coordinates
		);
	}

	function getVerticalScreenDifference(geometry, object, camera, renderer) {
		const positions = geometry.attributes.position;

		// Ensure we have at least 2 vertices
		if (positions.count < 2) {
			console.error("Geometry does not have enough vertices.");
			return null;
		}

		// Get the world positions of the first two vertices
		const vertex0 = new THREE.Vector3().fromBufferAttribute(positions, 0).applyMatrix4(object.matrixWorld);
		const vertex1 = new THREE.Vector3().fromBufferAttribute(positions, 1).applyMatrix4(object.matrixWorld);

		// Convert them to screen space
		const screen0 = worldToScreen(vertex0, camera, renderer);
		const screen1 = worldToScreen(vertex1, camera, renderer);

		// Compute difference
		return new THREE.Vector2().subVectors(screen1, screen0);
	}
	async function step() {
		pipeline.scene.scale.set(glob.scale, glob.scale, glob.scale);
		stage.step();
		update_entities();
		get_compressor_distance();
		return false;
	}

	function update_entities() {
		// Updating is different from object-stepping
		for (const entity of entities) {
			entity.update();
		}
	}

	export namespace stage {

		export function step() {
			opkl();
			// Testing new lighting mode
			//glob.reprerender = true;
			//glob.dirtyobjects = true;
		}

		export async function init() {
			await preload();
			await boot();

			// glob.magiccamerarotation = tfStageCameraRotation;
		}

		async function preload() {
			await pipeline.preloadTextureAsync('./img/textures/star.jpg');
			await pipeline.preloadTextureAsync('./img/textures/starnormal.jpg');
			await pipeline.preloadTextureAsync('./img/textures/japanese2.jpg');
			await pipeline.preloadTextureAsync('./img/textures/japanese3.jpg');
			await pipeline.preloadTextureAsync('./img/textures/japanese4.jpg');
			await pipeline.preloadTextureAsync('./img/textures/wall1.jpg');
			await pipeline.preloadTextureAsync('./img/textures/wall1normal.jpg');
			await pipeline.preloadTextureAsync('./img/textures/wall2.jpg');
			await pipeline.preloadTextureAsync('./img/textures/wall2normal.jpg');
			await pipeline.preloadTextureAsync('./img/textures/water.jpg');
			await pipeline.preloadTextureAsync('./img/textures/overgrown_x.jpg');
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
			// await pipeline.preloadTextureAsync('./img/textures/overgrown.jpg');
			//await pipeline.loadTextureAsync('./img/textures/bricks.jpg');
		}

		async function boot() {
			const sun = new THREE.DirectionalLight('lavender', Math.PI / 3);
			pipeline.scene.add(sun);
			pipeline.scene.add(sun.target);
		}
	}
	// end of stage

	const entities: entity3d[] = []

	abstract class entity3d {
		entityGroup
		pos3d: vec2 = [0, 0]
		z = 0
		constructor(readonly gobj: game_object) {
			this.entityGroup = new THREE.Group();
			entities.push(this);
		}
		private _monolithAdd() {
			pipeline.groups.monolith.add(this.entityGroup);
		}
		private _monolithRemove() {
			this.entityGroup.parent.remove(this.entityGroup);
		}
		create() {
			this._create();
			this._monolithAdd();
		}
		delete() {
			this.free();
			this._delete();
			this._monolithRemove();
		}
		step() {
			this._step();
			this.translate(); // Mono debug
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
			const { wpos } = this.gobj;
			let pos = this.pos3d = pts.project(wpos);
			pos[1] = rome.roundToNearest(pos[1], glob.pancompress);
			// pos = pts.ceil(pos);
			this.entityGroup.position.fromArray([...pos, this.z]);
			this.entityGroup.updateMatrix();
		}
	}

	export abstract class shape3d extends entity3d {
		constructor(readonly data: shape_literal) {
			super(data.gobj);
			this.data = {
				shapeTexture: './img/textures/cobblestone3.jpg',
				shapeTextureNormal: './img/textures/stonemixednormal.jpg',
				shapeGroundTexture: './img/textures/stonemixed2.jpg',
				shapeGroundTextureNormal: './img/textures/stonemixed2normal.jpg',
				shapeGroundSpecular: 'lavender',
				...data
			}
		}
	}

	export namespace shape3d {
		export type literal = shape_literal;
	};

	export interface shape_literal {
		gobj: game_object,
		shapeType?: shape_types,
		shapeTexture?: string,
		shapeTextureNormal?: string,
		shapeGroundTexture?: string,
		shapeGroundTextureNormal?: string,
		shapeGroundSpecular?: string,
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
			if (TOGGLE_RENDER_AXES)
				this.entityGroup.add(new THREE.AxesHelper(12));
			this.translate();
		}
		protected override _delete() {
			this.hexTile.free();
		}
	}

	export let hexscalar = 7.1;

	class hex_tile {
		scalar
		group
		protected mesh
		constructor(readonly data: shape_literal) {
			this.scalar = hexscalar;
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
				specular: this.data.shapeGroundSpecular!,
				shininess: 7,
				normalScale: new THREE.Vector2(1, 1),
				map: pipeline.getTexture(this.data.shapeGroundTexture!),
				normalMap: pipeline.getTexture(this.data.shapeGroundTextureNormal!),
			});
			if (!TOGGLE_NORMAL_MAPS)
				material.normalMap = null;
			// geometry = new THREE.PlaneGeometry(10, 10);
			this.group = new THREE.Group();
			this.group.scale.set(1, 1, 1);
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
		// console.log('shapeMaker', data);
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
		stagger = false
		rotationGroup
		wallGroup
		wallMaterial
		constructor(data: shape_literal) {
			super(data);
		}
		protected override _create() {
			const { shapeSize } = this.data;
			const material = new THREE.MeshPhongMaterial({
				// color: 'red',
				map: pipeline.getTexture(this.data.shapeTexture!),
				normalMap: pipeline.getTexture(this.data.shapeTextureNormal!)
			});
			if (!TOGGLE_NORMAL_MAPS)
				material.normalMap = null;
			this.wallGroup = wallMaker(this, material);
			this.wallGroup.position.set(5, 4, 0); // Push it up
			this.wallGroup.updateMatrix();
			this.rotationGroup = new THREE.Group();
			this.rotationGroup.add(this.wallGroup);
			this.rotationGroup.position.z = shapeSize![2] / 2;
			this.entityGroup.add(this.rotationGroup);
			if (TOGGLE_RENDER_AXES)
				this.entityGroup.add(new THREE.AxesHelper(12));
			this.translate();
			this._step();
			this.wallMaterial = material;
		}
		protected dispose() {
			//this.wallGroups.geometry.dispose();
			this.wallMaterial.dispose();
		}
		protected override _delete() {
			this.dispose();
		}
		protected override _step() {
			this.rotationGroup.rotation.set(0, 0, glob.wallrotation);
			this.rotationGroup.updateMatrix();
			this.entityGroup.updateMatrix();
		}
	}

	function wallMaker(shape: shape_wall, material) {
		let { shapeSize } = shape.data;
		const size = shapeSize!;
		const group = new THREE.Group();
		const gobj = shape.data.gobj;
		const wall3d = gobj as wall3d;
		const adapter = wall3d.wallAdapter;
		const staggerData = wall3d.data.extra!.staggerData as staggered_area.typee;
		if (!adapter) {
			console.warn(' no direction adapter for wallmaker ');
			return;
		}
		const interpol = (
			gobj: game_object,
			to: game_object.helpers.direction,
			from: game_object.helpers.direction) => {
			const fromObjects = adapter.get_all_objects_at(from);
			const toObjects = adapter.get_all_objects_at(to);

			const fromObject = fromObjects![0];
			const toObject = toObjects![0];

			const ourPosition = pts.project(gobj.wpos);

			const fromPosition = pts.project(fromObject.wpos);
			const toPosition = pts.project(toObject.wpos);

			let midX = ((fromPosition[0] + toPosition[0]) / 2) - ourPosition[0];
			let midY = ((fromPosition[1] + toPosition[1]) / 2) - ourPosition[1];

			let midPoint = [midX, midY] as vec2;
			midPoint = pts.round(midPoint);
			return midPoint;
		}
		let geometry, mesh;
		// Outward stagger
		// Tiles above and to the lower right
		if (adapter.tile_occupied('northwest') &&
			adapter.tile_occupied('east')) {

			let point = interpol(wall3d, 'northwest', 'east');
			if (staggerData?.isNorth) {
				//point = pts.add(point, [-size[1] / 2, 0]);
			}
			point = pts.add(point, [-3, -4]);
			geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
			mesh = new THREE.Mesh(geometry, material);
			//mesh.position.set(-size[0] / 2 + size[0] / magic, 0, 0);
			mesh.position.set(point[0], point[1], 0);
			mesh.rotation.set(0, 0, Math.PI / 2);

			mesh.updateMatrix();
			group.add(mesh);
		}
		// Inward stagger
		// Tiles to the top left and to the bottom
		else if (
			adapter.tile_occupied('west') &&
			adapter.tile_occupied('southeast')) {

			let point = [0, 0] as vec2;
			if (staggerData?.isNorth) {
				//point = pts.add(point, [-size[1] / 2, 0]);
			}
			// let point = interpol(wall3d, 'west', 'southeast');
			point = pts.add(point, [-4, 0]);
			geometry = new THREE.BoxGeometry(size[0] / 2, size[1], size[2]);
			// material.color = new THREE.Color('red');
			mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(point[0], point[1], 0);
			mesh.rotation.set(0, 0, Math.PI / 2);
			mesh.updateMatrix();
			group.add(mesh);
		}
		if (adapter.tile_occupied('north')
		) {
			geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
			// geometry.translate(0, 0, 0);
			mesh = new THREE.Mesh(geometry, material);
			// mesh.rotation.set(0, 0, Math.PI / 2);
			group.add(mesh);
		}
		if (adapter.tile_occupied('south')) {
			geometry = new THREE.BoxGeometry(size[0] / 2, size[1], size[2]);
			mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(-size[0] / 4, 0, 0);
			mesh.updateMatrix();
			group.add(mesh);
		}
		/*if (adapter.tile_occupied('east')) {
			geometry = new THREE.BoxGeometry(size[0] / 2, size[1] / 2, size[2]);
			geometry.translate(-size[0] / 4, size[1] / 4, 0);
			geometries.push(geometry);
		}*/

		/*if (adapter.tile_occupied('west')) {
			geometry = new THREE.BoxGeometry(size[0] / 2, size[1] / 2, size[2]);
			geometry.translate(-size[0] / 4, -size[1] / 4, 0);
			geometries.push(geometry);
		}*/
		if (adapter.tile_occupied('north') &&
			adapter.tile_occupied('east') ||
			adapter.tile_occupied('east') &&
			adapter.tile_occupied('south') ||
			adapter.tile_occupied('south') &&
			adapter.tile_occupied('west') ||
			adapter.tile_occupied('west') &&
			adapter.tile_occupied('north')
		) {
			// Middle piece!
			geometry = new THREE.BoxGeometry(size[0] / 2, size[1] / 2, size[2]);
			geometry.translate(-size[0] / 4, size[1] / 4, 0);
			// geometries.push(geometry);
		}
		//if (!geometries.length)
		//	return;
		//const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
		//return mergedGeometry;
		return group;
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
		lyft(pos: vec2) {
			// Experimental
			this.entityGroup.position.z += 1;
		}
		protected override _step() {
		}
		protected override _update() {
			// Dance the light source
			//glob.reprerender = true;
			//glob.dirtyobjects = true;
			//return;
			this.light.position.x = 3;
			this.light.updateMatrix();
			const secondsPerRotation = 4;
			this.entityGroup.rotation.z += (Math.PI * 2) * (1 / secondsPerRotation * glob.delta);
			//this.entityGroup.position.x += glob.delta;
			this.entityGroup.updateMatrix();
			this.light.updateMatrix();
			glob.reprerender = true;
			glob.dirtyobjects = true;
		}
		protected override _delete() {
			console.log('remove light');
			// super._delete();
		}
		protected override _create() {
			console.log(' tf light source create ');
			this.light = new THREE.PointLight('white', 1, 5);
			// this.light.decay = 2.4;
			this.light.intensity = 700 * (glob.scale * 2);
			this.light.distance = 600 * (glob.scale * 2);
			this.light.decay = 2.3;
			this.light.updateMatrix();
			this.entityGroup.add(this.light);
			// Translate
			this.z = 4;
			this.translate();
			this.entityGroup.updateMatrix();
			// this.entityGroup.updateMatrixWorld(true); // Bad
			pipeline.groups.monolith.add(this.entityGroup);
			glob.reprerender = true;
			glob.dirtyobjects = true;
		}
	}

	function opkl() {
		if (app.key('f1') == 1) {
			TOGGLE_TOP_DOWN_MODE = !TOGGLE_TOP_DOWN_MODE;
			if (TOGGLE_TOP_DOWN_MODE) {
				glob.magiccamerarotation = 0;
			} else {
				glob.magiccamerarotation = glob.constantmagiccamerarotation;
			}
		}
		else if (app.key('f2') == 1) {
			TOGGLE_RENDER_AXES = !TOGGLE_RENDER_AXES;
		}
		else if (app.key('f3') == 1) {
			TOGGLE_NORMAL_MAPS = !TOGGLE_NORMAL_MAPS;
		}
		else if (app.key('k') == 1) {
			glob.wallrotation -= .01;
		}
		else if (app.key('l') == 1) {
			glob.wallrotation += .01;
		}
		else if (app.key('v') == 1) {
			if (glob.magiccamerarotation > 0)
				glob.magiccamerarotation -= .01;
		}
		else if (app.key('b') == 1) {
			glob.magiccamerarotation += .01;
		}
		else if (app.key('q') == 1) {
			glob.hexsize = pts.add(glob.hexsize, [0, 1]);
		}
		else if (app.key('a') == 1) {
			glob.hexsize = pts.add(glob.hexsize, [0, -1]);
		}
		else if (app.key('1') == 1) {
			glob.hexsize = pts.add(glob.hexsize, [-1, 0]);
		}
		else if (app.key('2') == 1) {
			glob.hexsize = pts.add(glob.hexsize, [1, 0]);
		}
		else {
			return;
		}
		rome.purgeRemake();
	}
}

export default tileform;