import pan from "./components/pan.js";
import clod from "./clod.js";
import game_object from "./objects/game object.js";
import sprite3d from "./sprite 3d.js";

/// 🌍 WorldManager (clean and direct)

enum mergeMode {
	dont = 0, merge, replace
}

class world_manager {
	static world: clod.world; // Todo glob.world

	static init() {
		this.world = clod.init();
	}

	static update() {
		this.world.update(pan.wpos);
	}

	static repopulate() {

	}

	static getObjectsAt(target: game_object) {
		const { wpos: pos } = target;
		return world_manager.world.chunkatwpos(pos).objectsatwpos(pos) as game_object[];
	}

	static addGobj(gobj: game_object) {
		clod.add(world_manager.world, gobj);
	}

	static removeGobj(gobj: game_object) {
		clod.remove(gobj);
	}

	static merge_difficult(target: game_object) {
		let objects = this.getObjectsAt(target);
		let merged = false;
		for (let seated of objects) {
			if (
				seated.data._type == 'wall 3d' &&
				target.data._type == 'tile 3d'
			) {
				seated.sprite3dliteral = {
					...seated.sprite3dliteral!,
					...target.sprite3dliteral!,
					shapeType: 'wall',
					gobj: target,
					groundPreset: 'water'
				};
				console.log(' water! ', seated.data._type, target.data._type);
				merged = true;
			}
			else if (
				seated.data._type == 'tile 3d' &&
				target.data._type == 'wall 3d'
			) {
				const sprite3dliteral = {
					//...seated.sprite3dliteral!,
					...target.sprite3dliteral!,
					gobj: target,
					shapeType: 'wall',
					// groundPreset: 'water',
					groundPreset: target.sprite3dliteral?.groundPreset,
				} as sprite3d.literaltype;
				console.log('remoev!');
				
				clod.remove(seated);
				target.sprite3dliteral = sprite3dliteral;
				merged = false;
			}
			else if (
				seated.data._type == 'wall' ||
				seated.data._type == 'tile'
			) {
				merged = true;
			}
		}
		if (!merged) {
			clod.addWait(world_manager.world, target);
		}
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
				this.merge_difficult(gobj);
			else if (mode === mergeMode.replace)
				this._replace(gobj);
			else if (mode === mergeMode.dont)
				clod.addWait(world_manager.world, gobj);
		}
		// Now show
		for (const gobj of gobjs) {
			if (gobj.chunk?.active)
				gobj.show();
		}
	}
}

export default world_manager;