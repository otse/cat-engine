import app from "./app.js";
import hooks from "./dep/hooks.js";
import renderer from "./worldetch/renderer.js";
import tileform from "./worldetch/tileform.js";
import tile3d from "./worldetch/objects/tile 3d.js";
import wall3d from "./worldetch/objects/wall 3d.js";
import zoom from "./worldetch/components/zoom.js";
import pan from "./worldetch/components/pan.js";
import debug_screen from "./worldetch/components/debug screen.js";
import lod from "./worldetch/lod.js";
import glob from "./dep/glob.js";
import romanlike from "./eye/romanlike.js";
import light from "./worldetch/objects/light.js";
import pts from "./dep/pts.js";
import game from "./eye/game.js";
import world from "./worldetch/world.js";
import worldetch__ from "./worldetch/worldetch.js";
var worldetch;
(function (worldetch) {
    async function init() {
        console.log(' init ');
        worldetch__.init({});
        glob.sample =
            (a) => a[Math.floor(Math.random() * a.length)];
        glob.round_to_nearest =
            (value, nearest) => Math.round(value / nearest) * nearest;
        await preload_basic_textures();
        await renderer.init();
        await tileform.init();
        romanlike.init();
        world.init();
        game.init();
        app;
        make_testing_chamber();
        // Uncomment them if you don't need it
        debug_screen.register();
        zoom.register();
        pan.register();
        // new sprite({ size: [12, 8] });
        // What might this do
    }
    worldetch.init = init;
    async function preload_basic_textures() {
        await renderer.preloadTextureAsync('./img/hex/tile.png', 'nearest');
        await renderer.preloadTextureAsync('./img/hex/wall.png', 'nearest');
        await renderer.preloadTextureAsync('./img/hex/post.png', 'nearest');
    }
    function make_testing_chamber() {
        let gobjs = [];
        const collect = (gobj) => gobjs.push(gobj);
        collect(new tile3d({ colorOverride: 'pink', _wpos: [-1, 0, 0] }, 'cobblestone'));
        collect(new tile3d({ colorOverride: 'salmon', _wpos: [-1, -1, 0] }));
        collect(new tile3d({ colorOverride: 'cyan', _wpos: [0, -1, 0] }));
        collect(new tile3d({ colorOverride: 'yellow', _wpos: [-1, 1, 0] }));
        collect(new tile3d({ colorOverride: 'yellow', _wpos: [0, 1, 0] }));
        collect(new tile3d({ colorOverride: 'salmon', _wpos: [0, 2, 0] }));
        collect(new tile3d({ colorOverride: 'yellow', _wpos: [0, 3, 0] }));
        collect(new tile3d({ colorOverride: 'orange', _wpos: [0, 4, 0] }));
        collect(new tile3d({ colorOverride: 'red', _wpos: [0, 5, 0] }));
        collect(new tile3d({ colorOverride: 'blue', _wpos: [0, 6, 0] }));
        collect(new tile3d({ colorOverride: 'wheat', _wpos: [0, 7, 0] }));
        collect(new tile3d({ colorOverride: 'lavender', _wpos: [0, 8, 0] }));
        collect(new tile3d({ colorOverride: 'cyan', _wpos: [0, 9, 0] }));
        /*collect(new tile({ colorOverride: 'orange', _wpos: [1, -1, 0] }));
        collect(new tile({ colorOverride: 'red', _wpos: [0, 0, 0] }));
        collect(new tile({ colorOverride: 'pink', _wpos: [1, 0, 0] }));
        collect(new tile({ colorOverride: 'blue', _wpos: [0, 1, 0] }));
        collect(new tile({ _wpos: [1, 1, 0] }));
        collect(new tile({ _wpos: [0, 2, 0] }));
        collect(new tile({ _wpos: [1, 0, 0] }));
        collect(new tile({ _wpos: [2, 0, 0] }));
        collect(new tile({ _wpos: [3, 0, 0] }));
        collect(new tile({ _wpos: [4, 0, 0] }));
        collect(new tile({ _wpos: [5, 0, 0] }));
        collect(new tile({ _wpos: [6, 0, 0] }));
        collect(new tile({ _wpos: [7, 0, 0] }));*/
        collect(new wall3d({ colorOverride: 'green', _wpos: [2, 1, 0] }));
        collect(new wall3d({ colorOverride: 'lavender', _wpos: [2, 3, 0] }));
        collect(new wall3d({ colorOverride: 'magenta', _wpos: [3, 1, 0] }));
        collect(new wall3d({ colorOverride: 'pink', _wpos: [3, 2, 0] }));
        collect(new wall3d({ colorOverride: 'blue', _wpos: [3, 3, 0] }));
        collect(new wall3d({ colorOverride: 'red', _wpos: [4, 3, 0] }));
        collect(new wall3d({ colorOverride: 'purple', _wpos: [5, 3, 0] }));
        // collect(new tile({ _wpos: [4, 2, 0] }));
        collect(new light({ _wpos: [2, 2, 0] }));
        collect(new light({ _wpos: [-11, 6, 0] }));
        collect(new light({ _wpos: [9, 2, 0] }));
        collect(new wall3d({ colorOverride: 'magenta', _wpos: [1, 2, 0] }));
        collect(new wall3d({ colorOverride: 'pink', _wpos: [1, 3, 0] }));
        collect(new wall3d({ colorOverride: 'blue', _wpos: [1, 4, 0] }));
        collect(new wall3d({ colorOverride: 'red', _wpos: [1, 5, 0] }));
        collect(new wall3d({ colorOverride: 'purple', _wpos: [1, 6, 0] }));
        collect(new wall3d({ colorOverride: 'purple', _wpos: [1, 7, 0] }));
        collect(new wall3d({ colorOverride: 'purple', _wpos: [1, 8, 0] }));
        // collect(new wall({ _wpos: [4, 1, 0] }));
        // collect(new wall({ _wpos: [5, 1, 0] }));
        world.default_world.add_multiple_with_rule(gobjs, world.merge_rule.soft);
        // land.fill();
    }
    worldetch.make_testing_chamber = make_testing_chamber;
    function purge_remake() {
        console.warn(' purgeRemake ');
        const chunks = lod.helpers.get_every_chunk(world.default_world.world);
        for (const chunk of chunks) {
            chunk.nuke();
        }
        tileform.purge();
        renderer.purge();
        world.init();
        // world_manager.repopulate();
        game.repopulate();
        make_testing_chamber();
    }
    worldetch.purge_remake = purge_remake;
    function step() {
        hooks.emit('worldetchComponents', 1);
        hooks.emit('worldetchStep', 0);
        tileform.step();
        keys();
        world.default_world.update();
        game.update();
    }
    worldetch.step = step;
    function keys() {
        if (app.key('-') == 1) {
            if (worldetch__.scale > 1)
                worldetch__.scale -= 1;
            // Our wpos is still correct, but our rpos is now outdated
            pan.rpos = pts.mult(pts.project(pan.wpos, worldetch__.hex_size), worldetch__.scale);
            console.log(worldetch__.scale);
            purge_remake();
        }
        if (app.key('=') == 1) {
            worldetch__.scale += 1;
            // Our wpos is still correct, but our rpos is now outdated
            pan.rpos = pts.mult(pts.project(pan.wpos, worldetch__.hex_size), worldetch__.scale);
            console.log(worldetch__.scale);
            purge_remake();
        }
        if (app.key('c') == 1) {
            const chunks = lod.helpers.get_every_chunk(world.default_world.world);
            console.log('chunks', chunks);
        }
        if (app.key('a') == 1) {
            console.log('arrays', world.default_world.world.arrays);
        }
        if (app.key('t') == 1) {
            world.default_world.world.grid.shrink();
        }
        if (app.key('g') == 1) {
            world.default_world.world.grid.grow();
        }
        if (app.key('[') == 1) {
            tileform.hexscalar -= .1;
            console.log(tileform.hexscalar);
            purge_remake();
        }
        if (app.key(']') == 1) {
            tileform.hexscalar += .1;
            console.log(tileform.hexscalar);
            purge_remake();
        }
    }
})(worldetch || (worldetch = {}));
export default worldetch;
