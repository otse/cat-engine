import app from "./app.js";
import hooks from "./dep/hooks.js";
import renderer from "./core/renderer.js";
import tileform from "./core/tileform.js";
import tile3d from "./core/objects/tile 3d.js";
import wall3d from "./core/objects/wall 3d.js";
import zoom from "./core/components/zoom.js";
import pan from "./core/components/pan.js";
import debug_screen from "./core/components/debug screen.js";
import clod from "./core/clod.js";
import glob from "./dep/glob.js";
import romanlike from "./eye/romanlike.js";
import light from "./core/objects/light.js";
import pts from "./dep/pts.js";
import game from "./eye/game.js";
import world_manager from "./core/world manager.js";
var worldetch;
(function (worldetch) {
    function sample(a) {
        return a[Math.floor(Math.random() * a.length)];
    }
    worldetch.sample = sample;
    function clamp(val, min, max) {
        return val > max ? max : val < min ? min : val;
    }
    worldetch.clamp = clamp;
    function roundToNearest(value, nearest) {
        return Math.round(value / nearest) * nearest;
    }
    worldetch.roundToNearest = roundToNearest;
    async function init() {
        console.log(' init ');
        glob.rome = worldetch;
        glob.reprerender = true;
        glob.dirtyobjects = true;
        glob.randomspritecolor = false;
        glob.scale = 1;
        glob.constantmagiccamerarotation = 0.962;
        glob.magiccamerarotation = glob.constantmagiccamerarotation;
        glob.hexsize = [17, 9];
        glob.hexsize = [17, 15]; // Monolith
        glob.pancompress = 2; // Mono
        glob.camerarpos = [0, 0];
        glob.gobjscount = [0, 0];
        glob.sample = worldetch.sample;
        await preload_basic_textures();
        await renderer.init();
        await tileform.init();
        romanlike.init();
        world_manager.init();
        game.init();
        app;
        makeTestingChamber();
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
    function makeTestingChamber() {
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
        world_manager.add_multiple(gobjs, 1);
        // land.fill();
    }
    worldetch.makeTestingChamber = makeTestingChamber;
    function purgeRemake() {
        console.warn(' purgeRemake ');
        const chunks = clod.helpers.get_every_chunk(world_manager.world);
        for (const chunk of chunks) {
            chunk.nuke();
        }
        glob.reprerender = true;
        glob.dirtyobjects = true;
        tileform.purge();
        renderer.purge();
        world_manager.init();
        world_manager.repopulate();
        game.repopulate();
        makeTestingChamber();
    }
    worldetch.purgeRemake = purgeRemake;
    function step() {
        hooks.emit('worldetchComponents', 1);
        hooks.emit('worldetchStep', 0);
        keys();
        world_manager.update();
        game.update();
        glob.reprerender = false;
    }
    worldetch.step = step;
    function keys() {
        if (app.key('h') == 1) {
            glob.randomspritecolor = !glob.randomspritecolor;
            purgeRemake();
        }
        if (app.key('-') == 1) {
            if (glob.scale > 1)
                glob.scale -= 1;
            // Our wpos is still correct, but our rpos is now outdated
            pan.rpos = pts.mult(pts.project(pan.wpos), glob.scale);
            console.log(glob.scale);
            purgeRemake();
        }
        if (app.key('=') == 1) {
            glob.scale += 1;
            // Our wpos is still correct, but our rpos is now outdated
            pan.rpos = pts.mult(pts.project(pan.wpos), glob.scale);
            console.log(glob.scale);
            purgeRemake();
        }
        if (app.key('c') == 1) {
            const chunks = clod.helpers.get_every_chunk(world_manager.world);
            console.log('chunks', chunks);
        }
        if (app.key('a') == 1) {
            console.log('arrays', world_manager.world.arrays);
        }
        if (app.key('t') == 1) {
            world_manager.world.grid.shrink();
            glob.reprerender = true;
            glob.dirtyobjects = true;
        }
        if (app.key('g') == 1) {
            world_manager.world.grid.grow();
            glob.reprerender = true;
            glob.dirtyobjects = true;
        }
        if (app.key('[') == 1) {
            tileform.hexscalar -= .1;
            console.log(tileform.hexscalar);
            purgeRemake();
        }
        if (app.key(']') == 1) {
            tileform.hexscalar += .1;
            console.log(tileform.hexscalar);
            purgeRemake();
        }
    }
})(worldetch || (worldetch = {}));
export default worldetch;
