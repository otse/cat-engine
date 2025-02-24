import pan from "./components/pan.js";
import clod from "./clod.js";
var world_manager;
(function (world_manager) {
    function init() {
        world_manager.world = clod.init();
    }
    world_manager.init = init;
    function update() {
        world_manager.world.update(pan.wpos);
    }
    world_manager.update = update;
    function repopulate() {
    }
    world_manager.repopulate = repopulate;
    function addGobj(gobj) {
        clod.add(world_manager.world, gobj);
    }
    world_manager.addGobj = addGobj;
    function removeGobj(gobj) {
        clod.remove(gobj);
    }
    world_manager.removeGobj = removeGobj;
    function merge(target) {
        const objs = world_manager.world.chunkatwpos(target.wpos).objsatwpos(target.wpos);
        let merged = false;
        for (const gobj of objs) {
            if (gobj.data._type == 'wall 3d' ||
                gobj.data._type == 'tile 3d' &&
                    target.data._type == 'wall 3d' ||
                target.data._type == 'tile 3d') {
                gobj.sprite3dliteral = {
                    ...gobj.sprite3dliteral,
                    ...target.sprite3dliteral,
                    groundPreset: 'water'
                };
                console.log(' merge tile3d or wall3d ');
                merged = true;
            }
            else if (gobj.data._type == 'wall' ||
                gobj.data._type == 'tile') {
                merged = true;
            }
        }
        if (!merged) {
            clod.addWait(world_manager.world, target);
        }
    }
    world_manager.merge = merge;
    function replace(target) {
        const objs = world_manager.world.chunkatwpos(target.wpos).objsatwpos(target.wpos);
        let replaced = false;
        for (const gobj of objs) {
            clod.remove(gobj);
        }
        clod.addWait(world_manager.world, target);
    }
    world_manager.replace = replace;
    let mergeMode;
    (function (mergeMode) {
        mergeMode[mergeMode["dont"] = 0] = "dont";
        mergeMode[mergeMode["merge"] = 1] = "merge";
        mergeMode[mergeMode["replace"] = 2] = "replace";
    })(mergeMode || (mergeMode = {}));
    // To merge means to respect what's already there
    function addMerge(gobjs, mode) {
        // wall3ds render both walls and hex tiles at the same time
        // this saves a render but requires this merge function
        for (const gobj of gobjs) {
            if (mode === mergeMode.merge)
                merge(gobj);
            else if (mode === mergeMode.replace)
                replace(gobj);
            else if (mode === mergeMode.dont)
                clod.addWait(world_manager.world, gobj);
        }
        // Now show
        for (const gobj of gobjs) {
            if (gobj.chunk?.active)
                gobj.show();
        }
    }
    world_manager.addMerge = addMerge;
})(world_manager || (world_manager = {}));
export default world_manager;
