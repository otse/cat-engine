import pan from "./components/pan.js";
import Loom from "./loom.js";
import glob from "./../dep/glob.js";
/// 🌍 WorldManager (clean and direct)
export class WorldManager {
    static world;
    static init() {
        this.world = glob.world = Loom.init();
    }
    static update() {
        this.world.update(pan.wpos);
    }
    static repopulate() {
    }
    static getObjectsAt(target) {
        const { wpos: pos } = target;
        return this.world.chunkAtWpos(pos).ObjsAtWpos(pos);
    }
    static addGameObject(gobj) {
        Loom.add(this.world, gobj);
    }
    static removeGameObject(gobj) {
        Loom.remove(gobj);
    }
    static _replace(target) {
        const objects = this.getObjectsAt(target);
        for (const gobj of objects) {
            Loom.remove(gobj);
        }
        Loom.addDontYetShow(this.world, target);
    }
    static addMultiple(gobjs, mode) {
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
    static _merge(target) {
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
            Loom.addDontYetShow(this.world, target);
        }
    }
}
(function (WorldManager) {
    let merge_mode;
    (function (merge_mode) {
        merge_mode[merge_mode["dont"] = 0] = "dont";
        merge_mode[merge_mode["merge"] = 1] = "merge";
        merge_mode[merge_mode["replace"] = 2] = "replace";
    })(merge_mode = WorldManager.merge_mode || (WorldManager.merge_mode = {}));
})(WorldManager || (WorldManager = {}));
;
export default WorldManager;
