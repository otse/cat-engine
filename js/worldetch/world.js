import pan from "./components/pan.js";
import lod from "./lod.js";
import glob from "../dep/glob.js";
// Welcome to the chaos of worldetch! 🌍🔥
// 🌍 World Class
// This is a wrapper around /lod.ts lod.world
// It has a powerful function to add multiple objects using a simple merge rule!
// Ex:
// const den_of_evil = new worldetch.world()
export class world {
    static default_world;
    world;
    static init() {
        this.default_world = new world();
    }
    constructor() {
        this.world = glob.world = lod.make_world();
    }
    update() {
        this.world.update(pan.wpos);
    }
    get_objects_at(target) {
        const { wpos: pos } = target;
        return this.world._chunkatwpos(pos)._objsatwpos(pos);
    }
    add(gobj) {
        lod.add(this.world, gobj);
    }
    remove(gobj) {
        lod.remove(gobj);
    }
    add_multiple_with_rule(gobjs, rule) {
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
    _replace(target) {
        const objects = this.get_objects_at(target);
        for (const gobj of objects) {
            lod.remove(gobj);
        }
        lod.add(this.world, target, false);
    }
    _merge(target) {
        let objects = this.get_objects_at(target);
        let addTarget = true;
        for (let present of objects) {
            if (present.data._type == 'tile 3d' &&
                target.data._type == 'tile 3d') {
                addTarget = false;
                present.preset = target.preset;
            }
        }
        if (addTarget)
            lod.add(this.world, target, false);
    }
}
(function (world) {
    let merge_rule;
    (function (merge_rule) {
        merge_rule[merge_rule["dont"] = 0] = "dont";
        merge_rule[merge_rule["soft"] = 1] = "soft";
        merge_rule[merge_rule["replace"] = 2] = "replace";
    })(merge_rule = world.merge_rule || (world.merge_rule = {}));
})(world || (world = {}));
;
export default world;
