import pan from "./components/pan.js";
import lod from "./lod.js";
import game_object from "./objects/game object.js";
import glob from "../dep/glob.js";
import tile3d from "./objects/tile 3d.js";

// Welcome to the chaos of worldetch! 🌍🔥

// 🌍 World Class

// Wrapper for the `lod.world` provided in `/lod.ts`.

// Adds objects with a configurable merge rule.

// Ex:
// const den_of_evil = new worldetch.world()

export class world {
	static default_world: world

	world: lod.world

	static init() {
		this.default_world = new world();
	}

	constructor() {
		this.world = glob.world = lod.make_world();
	}

	update() {
		this.world.update(pan.wpos);
	}

	get_objects_at(target: game_object) {
		const { wpos: pos } = target;
		return this.world._chunkatwpos(pos)._objsatwpos(pos) as game_object[];
	}

	add(gobj: game_object) {
		lod.add(this.world, gobj);
	}

	remove(gobj: game_object) {
		lod.remove(gobj);
	}

	add_multiple_with_rule(gobjs: game_object[], rule: world.merge_rule) {
		for (let gobj of gobjs) {
			switch (rule) {
				case world.merge_rule.soft:
					this._merge(gobj);
					break;
				case world.merge_rule.replace:
					this._replace(gobj);
					break;
				case world.merge_rule.dont:
				default:
					lod.add(this.world, gobj, false);
					break;
			}
		}
		// Now show
		for (let gobj of gobjs) {
			if (gobj.chunk?.active)
				gobj.show();
		}
	}

	_replace(target: game_object) {
		const objects = this.get_objects_at(target);
		for (const gobj of objects) {
			lod.remove(gobj);
		}
		lod.add(this.world, target, false);
	}

	_merge(target: game_object) {
		let objects = this.get_objects_at(target);
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
		if (addTarget)
			lod.add(this.world, target, false);
	}
}

export namespace world {
	export enum merge_rule {
		dont = 0, soft, replace
	}
};

export default world;