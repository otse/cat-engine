import clod from "../core/clod.js";
import pan from "../core/components/pan.js";
import game_object from "../core/objects/game object.js";
import wall3d from "../core/objects/wall 3d.js";
import object3d from "../core/object 3d.js";
import tileform from "../core/tileform.js";
import world_manager from "../core/world manager.js";
import land from "./land.js";

export namespace game {
	export type groundPreset = keyof typeof groundPresets;
	export type shapePreset = keyof typeof shapePresets;

	export const groundPresets = {
		default: {
			shapeGroundTexture: './img/textures/beach.jpg',
			shapeGroundTextureNormal: './img/textures/beachnormal.jpg',
		} as tileform.shape3d.literal,
		stonemixed: {
			shapeGroundTexture: './img/textures/stonemixed2.jpg',
			shapeGroundTextureNormal: './img/textures/stonemixed2normal.jpg',
		} as tileform.shape3d.literal,
		cobblestone: {
			shapeGroundTexture: './img/textures/cobblestone3.jpg',
			shapeGroundTextureNormal: './img/textures/cobblestone3normal.jpg',
		} as tileform.shape3d.literal,
		water: {
			shapeGroundTexture: './img/textures/water.jpg',
			shapeGroundTextureNormal: './img/textures/beachnormal.jpg',
		} as tileform.shape3d.literal,
		star: {
			shapeGroundTexture: './img/textures/star.jpg',
			shapeGroundTextureNormal: './img/textures/starnormal.jpg',
			shapeGroundSpecular: 'cyan',
		} as tileform.shape3d.literal
	} as const;

	export const shapePresets = {
		default: {
			shapeTexture: './img/textures/wall2.jpg',
			shapeTextureNormal: './img/textures/wall2normal.jpg',
		} as tileform.shape3d.literal,
		elven: {
			shapeTexture: './img/textures/japanese3.jpg',
			shapeTextureNormal: './img/textures/cobblestone2normal.jpg',
		} as tileform.shape3d.literal,
		basalt: {
			shapeTexture: './img/textures/basaltcliffs.jpg',
			shapeTextureNormal: './img/textures/basalt.jpg',
		} as tileform.shape3d.literal
	} as const;

	export function init() {
		land.init();
		repopulate();
	}

	export function update() {
		// Does nothing!
	}

	export function repopulate() {
		land.repopulate();
	}	

}

export default game;