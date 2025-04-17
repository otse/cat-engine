import app from "./app.js";
import hooks from "./dep/hooks.js";
import pipeline from "./core/pipeline.js";
import tileform from "./core/tileform.js";
import tile3d from "./core/objects/tile 3d.js";
import wall3d from "./core/objects/wall 3d.js";
import zoom from "./core/components/zoom.js";
import pan from "./core/components/pan.js";
import clod from "./core/clod.js";
import glob from "./dep/glob.js";
import romanlike from "./eye/romanlike.js";
import light from "./core/objects/light.js";
import pts from "./dep/pts.js";
import game from "./eye/game.js";
import world_manager from "./core/world manager.js";
var hex_engine;
(function (hex_engine) {
    function sample(a) {
        return a[Math.floor(Math.random() * a.length)];
    }
    hex_engine.sample = sample;
    function clamp(val, min, max) {
        return val > max ? max : val < min ? min : val;
    }
    hex_engine.clamp = clamp;
    function roundToNearest(value, nearest) {
        return Math.round(value / nearest) * nearest;
    }
    hex_engine.roundToNearest = roundToNearest;
    async function init() {
        console.log(' init ');
        glob.rome = hex_engine;
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
        glob.sample = hex_engine.sample;
        await preload_basic_textures();
        await pipeline.init();
        await tileform.init();
        romanlike.init();
        world_manager.init();
        game.init();
        app;
        makeTestingChamber();
        zoom.register();
        pan.register();
        // new sprite({ size: [12, 8] });
        // What might this do
    }
    hex_engine.init = init;
    async function preload_basic_textures() {
        await pipeline.preloadTextureAsync('./img/hex/tile.png', 'nearest');
        await pipeline.preloadTextureAsync('./img/hex/wall.png', 'nearest');
        await pipeline.preloadTextureAsync('./img/hex/post.png', 'nearest');
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
        world_manager.addMergeLot(gobjs, 1);
        // land.fill();
    }
    hex_engine.makeTestingChamber = makeTestingChamber;
    function build_then_output_stats() {
        document.querySelector('rome-stats').innerHTML = `
			rogue - monolith git branch
			<br />DOTS_PER_INCH_CORRECTED_RENDER_TARGET: ${pipeline.DOTS_PER_INCH_CORRECTED_RENDER_TARGET}
			<br />ROUND_UP_DOTS_PER_INCH: ${pipeline.ROUND_UP_DOTS_PER_INCH}
			<br />USE_SCENE3: ${pipeline.USE_SCENE3}
			<br />DITHERING (d): ${pipeline.dithering}
			<br />--
			<br />TOGGLE_TOP_DOWN_MODE (f1): ${tileform.TOGGLE_TOP_DOWN_MODE}
			<br />TOGGLE_RENDER_AXES (f2): ${tileform.TOGGLE_RENDER_AXES}
			<br />TOGGLE_NORMAL_MAPS (f3): ${tileform.TOGGLE_NORMAL_MAPS}
			<br />--
			<br />"globs"
			<br />&#9;randomspritecolor (h): ${glob.randomspritecolor}
			<br />magiccamerarotation (v, b): ${glob.magiccamerarotation}
			<br />wallrotation (v, b): ${glob.wallrotation}
			<br />pancompress (v, b): ${glob.pancompress}
			<br />--
			<br />camera rotation x (v, b): ${glob.magiccamerarotation}
			<br />color correction (z): ${pipeline.compression}
			<br />render scale (-, =): ${glob.scale}
			<br />zoom scale (r, f): ${zoom.scale()}
			<br />grid (t, g): ${world_manager.world.grid.spread} / ${world_manager.world.grid.outside}
			<br />hexscalar ([, ]): ${tileform.hexscalar}
			<br />--
			<br />fps: ${glob.fps?.toFixed(2)} ${glob.delta?.toFixed(3)}
			<br />reprerender: ${glob.reprerender}
			<br />dirtyObjects: ${glob.dirtyobjects}
			<br />hex size (q, a): ${pts.to_string_fixed(glob.hexsize)}
			<!--<br />cameraMode: ${pipeline.cameraMode}-->
			<br />chunk span size: ${clod.chunk_span} x ${clod.chunk_span}
			<br />gobjs: ${glob.gobjscount[0]} / ${glob.gobjscount[1]}
			<br />chunks: ${clod.numbers.chunks[0]} / ${clod.numbers.chunks[1]}
			<br />pan wpos, rpos: ${pts.to_string_fixed(pan.wpos)} (${pts.to_string_fixed(pan.rpos)})
			`;
    }
    function purgeRemake() {
        console.warn(' purgeRemake ');
        const chunks = clod.helpers.get_every_chunk(world_manager.world);
        for (const chunk of chunks) {
            chunk.nuke();
        }
        glob.reprerender = true;
        glob.dirtyobjects = true;
        tileform.purge();
        pipeline.purge();
        world_manager.init();
        world_manager.repopulate();
        game.repopulate();
        makeTestingChamber();
    }
    hex_engine.purgeRemake = purgeRemake;
    function step() {
        hooks.emit('romeComponents', 1);
        hooks.emit('romeStep', 0);
        keys();
        build_then_output_stats();
        world_manager.update();
        game.update();
        glob.reprerender = false;
    }
    hex_engine.step = step;
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
})(hex_engine || (hex_engine = {}));
export default hex_engine;
