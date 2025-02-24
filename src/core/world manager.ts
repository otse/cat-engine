import pan from "./components/pan.js";
import clod from "./clod.js";
import game_object from "./objects/game object.js";

namespace world_manager {
    export var world: clod.world; // Todo glob.world

    export function init() {
        world = clod.init();
    }

    export function update() {
        world.update(pan.wpos);
    }

    export function repopulate() {

    }

    export function addGobj(gobj: game_object) {
        clod.add(world_manager.world, gobj);
    }

    export function removeGobj(gobj: game_object) {
        clod.remove(gobj);
    }

    export function merge(target: game_object) {
        const objs = world_manager.world.chunkatwpos(target.wpos).objsatwpos(target.wpos) as game_object[];
        let merged = false;
        for (const gobj of objs) {
            if (
                gobj.data._type! == 'wall 3d' ||
                gobj.data._type! == 'tile 3d' &&
                target.data._type == 'wall 3d' ||
                target.data._type == 'tile 3d'
            ) {
                gobj.sprite3dliteral = {
                    ...gobj.sprite3dliteral!,
                    ...target.sprite3dliteral!,
                    groundPreset: 'water'
                }
                console.log(' merge tile3d or wall3d ');
                merged = true;
            }
            else if (
                gobj.data._type! == 'wall' ||
                gobj.data._type! == 'tile'
            ) {
                merged = true;
            }
        }
        if (!merged) {
            clod.addWait(world_manager.world, target);
        }
    }

    export function replace(target: game_object) {
        const objs = world_manager.world.chunkatwpos(target.wpos).objsatwpos(target.wpos) as game_object[];
        let replaced = false;
        for (const gobj of objs) {
            clod.remove(gobj);
        }
        clod.addWait(world_manager.world, target);
    }

    enum mergeMode {
        dont = 0, merge, replace
    }

    // To merge means to respect what's already there

    export function addMerge(gobjs: game_object[], mode: mergeMode | number) {
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
}

export default world_manager;