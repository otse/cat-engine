import pan from "./components/pan.js";
import clod from "./clod.js";
import glob from "../dep/glob.js";
/// 🌍 WorldManager (clean and direct)
var mergeMode;
(function (mergeMode) {
    mergeMode[mergeMode["dont"] = 0] = "dont";
    mergeMode[mergeMode["merge"] = 1] = "merge";
    mergeMode[mergeMode["replace"] = 2] = "replace";
})(mergeMode || (mergeMode = {}));
class world_manager {
    static world;
    static init() {
        this.world = clod.init();
        glob.world = this.world;
    }
    static update() {
        this.world.update(pan.wpos);
    }
    static repopulate() {
    }
    static getObjectsAt(target) {
        const { wpos: pos } = target;
        return world_manager.world.chunkatwpos(pos).objsatwpos(pos);
    }
    static addGobj(gobj) {
        clod.add(world_manager.world, gobj);
    }
    static removeGobj(gobj) {
        clod.remove(gobj);
    }
    static _replace(target) {
        const objects = this.getObjectsAt(target);
        for (const gobj of objects) {
            clod.remove(gobj);
        }
        clod.addWait(world_manager.world, target);
    }
    // To merge means to respect what's already there
    static addMergeLot(gobjs, mode) {
        // wall3ds render both walls and hex tiles at the same time
        // this saves a render but requires this merge function
        for (const gobj of gobjs) {
            if (mode === mergeMode.merge)
                this.merge_ideally(gobj);
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
    // These are the most normal mergers,
    // like when you put a wall on a tile,
    // or a tile on a wall
    static merge_ideally(target) {
        let objects = this.getObjectsAt(target);
        let needsAdding = true;
        for (let object of objects) {
            if (object.data._type == 'tile 3d' &&
                target.data._type == 'tile 3d') {
                needsAdding = false;
                // Ideally just ignore our newly tiles
                // object.sprite3dliteral!.groundPreset = 'water';
            }
            // Rare situation where we want to adapt a wall 3d to a tile 3d
            if (target.data._type == 'tile 3d' &&
                object.data._type == 'wall 3d') {
                object.sprite3dliteral = {
                    ...object.sprite3dliteral,
                    groundPreset: target.sprite3dliteral?.groundPreset,
                };
                console.log(' water! ', object.data._type, target.data._type);
                needsAdding = false;
            }
            // When we put a wall 3d onto a tile 3d
            // but want to keep the ground
            else if (target.data._type == 'wall 3d' &&
                object.data._type == 'tile 3d') {
                target.sprite3dliteral = {
                    ...target.sprite3dliteral,
                    // groundPreset: object.sprite3dliteral?.groundPreset,
                };
                console.log('replace respect');
                clod.remove(object);
                needsAdding = true;
            }
            else if (object.data._type == 'wall' ||
                object.data._type == 'tile') {
                needsAdding = true;
            }
        }
        if (needsAdding) {
            clod.addWait(world_manager.world, target);
        }
    }
}
export default world_manager;
