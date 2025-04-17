import clod from "./core/clod";
import direction_adapter from "./core/direction adapter";
import object3d from "./core/object 3d";
import pipeline from "./core/pipeline";
import sprite from "./core/sprite";
import staggered_area from "./core/staggered area";
import tileform from "./core/tileform";
import world_manager from "./core/world manager";
import game_object_factory from "./core/objects/factory motivation";
import game_object from "./core/objects/game object";
import light from "./core/objects/light";
import tile3d from "./core/objects/tile 3d";
import wall3d from "./core/objects/wall 3d";
import aabb2 from "./dep/aabb2";
import area2 from "./dep/area2";
import hooks from "./dep/hooks";
import pts from "./dep/pts";
import glob from "./dep/glob";
export const HexEngine = {
    clod,
    direction_adapter,
    object3d,
    pipeline,
    sprite,
    staggered_area,
    tileform,
    world_manager,
    objects: {
        game_object_factory,
        game_object,
        light,
        tile3d,
        wall3d,
    },
    dep: {
        aabb2,
        area2,
        glob,
        hooks,
        pts
    }
};
