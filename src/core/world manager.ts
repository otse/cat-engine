import pan from "./components/pan.js";
import clod from "./clod.js";
import game_object from "./objects/game object.js";
import object3d from "./object 3d.js";
import glob from "./../dep/glob.js";

/// 🌍 WorldManager (clean and direct)

enum mergeMode {
	dont = 0, merge, replace
}

class world_manager {
	static world: clod.world;

	static init() {
		this.world = glob.world = clod.init();
	}

	static update() {
		this.world.update(pan.wpos);
	}

	static repopulate() {

	}

	static getObjectsAt(target: game_object) {
		const { wpos: pos } = target;
		return world_manager.world.chunkatwpos(pos).objsatwpos(pos) as game_object[];
	}

	static addGobj(gobj: game_object) {
		clod.add(world_manager.world, gobj);
	}

	static removeGobj(gobj: game_object) {
		clod.remove(gobj);
	}

	static _replace(target: game_object) {
		const objects = this.getObjectsAt(target);
		for (const gobj of objects) {
			clod.remove(gobj);
		}
		clod.addWait(world_manager.world, target);
	}

	// To merge means to respect what's already there

	static addMergeLot(gobjs: game_object[], mode: mergeMode | number) {
		// wall3ds render both walls and hex tiles at the same time
		// this saves a render but requires this merge function
		for (const gobj of gobjs) {
			if (mode === mergeMode.merge)
				this.merge_ideally(gobj);
			else if (mode === mergeMode.replace)
				this._replace(gobj);
			else if (mode === mergeMode.dont) // stack
				clod.addWait(world_manager.world, gobj);
		}
		// Now show
		for (const gobj of gobjs) {
			if (gobj.chunk?.active)
				gobj.show();
		}
	}

	// These are the most normal mergers,
	// like when you put a wall on a tile,
	// or a tile on a wall
	static merge_ideally(target: game_object) {
		let objects = this.getObjectsAt(target);
		let addTarget = true;
		for (let present of objects) {
			if (
				present.data._type == 'tile 3d' &&
				target.data._type == 'tile 3d'
			) {
				addTarget = false;
				present.object3dmerge_ = {
					...present.object3dmerge_!,
					groundPreset: target.object3dmerge_?.groundPreset,
				};
			}
		}
		if (addTarget) {
			clod.addWait(world_manager.world, target);
		}
	}

}

export default world_manager;