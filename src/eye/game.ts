import clod from "../core/clod.js";
import pan from "../core/components/pan.js";
import game_object from "../core/objects/game object.js";
import wall3d from "../core/objects/wall 3d.js";
import sprite3d from "../core/sprite 3d.js";
import tileform from "../core/tileform.js";
import world_manager from "../core/world manager.js";
import land from "./land.js";

export namespace game {
	export type groundPreset = keyof typeof groundPresets;
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