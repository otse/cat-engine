import pan from "./components/pan.js";
import clod from "./clod.js";
import glob from "./../dep/glob.js";
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
        this.world = glob.world = clod.init();
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
        clod.add_not_yet_create(world_manager.world, target);
    }
    static add_multiple(gobjs, mode) {
        for (let gobj of gobjs) {
            if (mode === mergeMode.merge)
                this.merge(gobj);
            else if (mode === mergeMode.replace)
                this._replace(gobj);
            else if (mode === mergeMode.dont) // stack
                clod.add_not_yet_create(world_manager.world, gobj);
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
    static merge(target) {
        let objects = this.getObjectsAt(target);
        let addTarget = true;
        for (let present of objects) {
            if (present.data._type == 'tile 3d' &&
                target.data._type == 'tile 3d') {
                addTarget = false;
                present.preset = target.preset;
            }
        }
        if (addTarget) {
            clod.add_not_yet_create(world_manager.world, target);
        }
    }
}
export default world_manager;
