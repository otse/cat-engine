import pan from "./components/pan.js";
import Loom from "./loom.js";
import game_object from "./objects/game object.js";
import glob from "./../dep/glob.js";
import tile3d from "./objects/tile 3d.js";

/// 🌍 WorldManager (clean and direct)

export class WorldManager {
	static world: Loom.World

	static init() {
		this.world = glob.world = Loom.init();
	}

	static update() {
		this.world.update(pan.wpos);
	}

	static repopulate() {

	}

	static getObjectsAt(target: game_object) {
		const { wpos: pos } = target;
		return this.world.chunkAtWpos(pos).ObjsAtWpos(pos) as game_object[];
	}

	static addGameObject(gobj: game_object) {
		Loom.add(this.world, gobj);
	}

	static removeGameObject(gobj: game_object) {
		Loom.remove(gobj);
	}

	static _replace(target: game_object) {
		const objects = this.getObjectsAt(target);
		for (const gobj of objects) {
			Loom.remove(gobj);
		}
		Loom.addDontYetShow(this.world, target);
	}

	static addMultiple(gobjs: game_object[], mode: WorldManager.merge_mode) {
		for (let gobj of gobjs) {
			if (mode === this.merge_mode.merge)
				this._merge(gobj);
			else if (mode === this.merge_mode.replace)
				this._replace(gobj);
			else if (mode === this.merge_mode.dont)
				Loom.addDontYetShow(this.world, gobj);
		}
		// Now show
		for (let gobj of gobjs) {
			if (gobj.chunk?.active)
				gobj.show();
		}
	}

	// These are the most normal mergers,
	// like when you put a wall on a tile,
	// or a tile on a wall
	static _merge(target: game_object) {
		let objects = this.getObjectsAt(target);
		let addTarget = true;
		for (let present of objects) {
			if (
				present.data._type == 'tile 3d' &&
				target.data._type == 'tile 3d'
			) {
				addTarget = false;
				(present as tile3d).preset = (target as tile3d).preset;
			}
		}
		if (addTarget) {
			Loom.addDontYetShow(this.world, target);
		}
	}
}

export namespace WorldManager {
	export enum merge_mode {
		dont = 0, merge, replace
	}
};

export default WorldManager;