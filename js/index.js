import lod from "./worldetch/lod";
import direction_adapter from "./worldetch/direction adapter";
import object3d from "./worldetch/object 3d";
import renderer from "./worldetch/renderer";
import sprite from "./worldetch/sprite";
import staggered_area from "./worldetch/staggered area";
import tileform from "./worldetch/tileform";
import world from "./worldetch/world";
import game_object_factory from "./worldetch/objects/factory motivation";
import game_object from "./worldetch/objects/game object";
import light from "./worldetch/objects/light";
import tile3d from "./worldetch/objects/tile 3d";
import wall3d from "./worldetch/objects/wall 3d";
import aabb2 from "./dep/aabb2";
import area2 from "./dep/area2";
import hooks from "./dep/hooks";
import pts from "./dep/pts";
import glob from "./dep/glob";
export const worldetch = {
    lod,
    direction_adapter,
    object3d,
    renderer,
    sprite,
    staggered_area,
    tileform,
    world,
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
