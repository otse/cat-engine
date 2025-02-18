import app from "./app.js";
import { hooks } from "./dep/hooks.js";
import pipeline from "./core/pipeline.js";
import tileform from "./core/tileform.js";
import tile3d from "./core/objects/tile 3d.js";
import wall3d from "./core/objects/wall 3d.js";
import zoom from "./core/components/zoom.js";
import pan from "./core/components/pan.js";
import clod from "./core/clod.js";
import glob from "./dep/glob.js";
import land from "./land.js";
import romanlike from "./romanlike/romanlike.js";
import light from "./core/objects/light.js";
var rome;
(function (rome) {
    function sample(a) {
        return a[Math.floor(Math.random() * a.length)];
    }
    rome.sample = sample;
    function clamp(val, min, max) {
        return val > max ? max : val < min ? min : val;
    }
    rome.clamp = clamp;
    async function init() {
        console.log(' init ');
        glob.rome = rome;
        glob.rerender = true;
        glob.rerenderObjects = true;
        glob.scale = 1;
        glob.hexSize = [17, 9];
        glob.gameobjects = [0, 0];
        await preload_basic_textures();
        await pipeline.init();
        await tileform.init();
        romanlike.init();
        land.init();
        rome.world = clod.init();
        app;
        makeTestingChamber();
        zoom.register();
        pan.register();
        // new sprite({ size: [12, 8] });
        // What might this do
    }
    rome.init = init;
    function addMergeOrReplace(target) {
        const chunk = rome.world.atwpos(target.wpos);
        const stacked = chunk.stacked(target.wpos);
        let merged = false;
        for (const gobj of stacked) {
            if (gobj.data._type == 'wall 3d') {
                const wall_ = gobj;
                wall_.data;
                console.log(' already wll here ');
                merged = true;
                // console.warn('boo');
            }
            else if (gobj.data._type == 'wall' ||
                gobj.data._type == 'tile') {
                merged = true;
            }
        }
        if (!merged) {
            clod.addNoCreate(rome.world, target);
        }
    }
    rome.addMergeOrReplace = addMergeOrReplace;
    function addLateGobjsBatch(gobjs, mode) {
        // This is ununderstandable
        for (const gobj of gobjs) {
            if (mode === 'keep')
                clod.addNoCreate(rome.world, gobj);
            else if (mode === 'merge')
                addMergeOrReplace(gobj);
        }
        for (const gobj of gobjs) {
            if (gobj.chunk?.active)
                gobj.show();
        }
    }
    rome.addLateGobjsBatch = addLateGobjsBatch;
    function addGobj(gobj) {
        // Parameter injection?
        clod.add(rome.world, gobj);
    }
    rome.addGobj = addGobj;
    function removeGobj(gobj) {
        clod.remove(gobj);
    }
    rome.removeGobj = removeGobj;
    async function preload_basic_textures() {
        await pipeline.preloadTextureAsync('./img/hex/tile.png', 'nearest');
        await pipeline.preloadTextureAsync('./img/hex/wall.png', 'nearest');
        await pipeline.preloadTextureAsync('./img/hex/post.png', 'nearest');
    }
    let gameObjects = [];
    function makeTestingChamber() {
        let gobjs = [];
        function collect(gobj) {
            gobjs.push(gobj);
            gameObjects.push(gobj);
        }
        collect(new tile3d({ _type: 'direct', colorOverride: 'pink', _wpos: [-1, 0, 0] }));
        collect(new tile3d({ _type: 'direct', colorOverride: 'salmon', _wpos: [-1, -1, 0] }));
        collect(new tile3d({ _type: 'direct', colorOverride: 'cyan', _wpos: [0, -1, 0] }));
        collect(new tile3d({ _type: 'direct', colorOverride: 'yellow', _wpos: [-1, 1, 0] }));
        collect(new tile3d({ _type: 'direct', colorOverride: 'yellow', _wpos: [0, 1, 0] }));
        collect(new tile3d({ _type: 'direct', colorOverride: 'salmon', _wpos: [0, 2, 0] }));
        collect(new tile3d({ _type: 'direct', colorOverride: 'yellow', _wpos: [0, 3, 0] }));
        collect(new tile3d({ _type: 'direct', colorOverride: 'orange', _wpos: [0, 4, 0] }));
        collect(new tile3d({ _type: 'direct', colorOverride: 'red', _wpos: [0, 5, 0] }));
        collect(new tile3d({ _type: 'direct', colorOverride: 'blue', _wpos: [0, 6, 0] }));
        collect(new tile3d({ _type: 'direct', colorOverride: 'wheat', _wpos: [0, 7, 0] }));
        collect(new tile3d({ _type: 'direct', colorOverride: 'lavender', _wpos: [0, 8, 0] }));
        collect(new tile3d({ _type: 'direct', colorOverride: 'cyan', _wpos: [0, 9, 0] }));
        /*collect(new tile({ _type: 'direct', colorOverride: 'orange', _wpos: [1, -1, 0] }));
        collect(new tile({ _type: 'direct', colorOverride: 'red', _wpos: [0, 0, 0] }));
        collect(new tile({ _type: 'direct', colorOverride: 'pink', _wpos: [1, 0, 0] }));
        collect(new tile({ _type: 'direct', colorOverride: 'blue', _wpos: [0, 1, 0] }));
        collect(new tile({ _type: 'direct', _wpos: [1, 1, 0] }));
        collect(new tile({ _type: 'direct', _wpos: [0, 2, 0] }));
        collect(new tile({ _type: 'direct', _wpos: [1, 0, 0] }));
        collect(new tile({ _type: 'direct', _wpos: [2, 0, 0] }));
        collect(new tile({ _type: 'direct', _wpos: [3, 0, 0] }));
        collect(new tile({ _type: 'direct', _wpos: [4, 0, 0] }));
        collect(new tile({ _type: 'direct', _wpos: [5, 0, 0] }));
        collect(new tile({ _type: 'direct', _wpos: [6, 0, 0] }));
        collect(new tile({ _type: 'direct', _wpos: [7, 0, 0] }));*/
        collect(new wall3d({ _type: 'direct', _wpos: [2, 1, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'magenta', _wpos: [3, 1, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'pink', _wpos: [3, 2, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'blue', _wpos: [3, 3, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'red', _wpos: [4, 3, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'purple', _wpos: [5, 3, 0] }));
        // collect(new tile({ _type: 'direct', _wpos: [4, 2, 0] }));
        collect(new light({ _type: 'direct', _wpos: [2, 3, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'magenta', _wpos: [1, 2, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'pink', _wpos: [1, 3, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'blue', _wpos: [1, 4, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'red', _wpos: [1, 5, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'purple', _wpos: [1, 6, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'purple', _wpos: [1, 7, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'purple', _wpos: [1, 8, 0] }));
        // collect(new wall({ _type: 'direct', _wpos: [4, 1, 0] }));
        // collect(new wall({ _type: 'direct', _wpos: [5, 1, 0] }));
        addLateGobjsBatch(gobjs, 'keep');
        land.make();
    }
    rome.makeTestingChamber = makeTestingChamber;
    function build_then_output_stats() {
        document.querySelector('rome-stats').innerHTML = `
			DOTS_PER_INCH_CORRECTED_RENDER_TARGET: ${pipeline.DOTS_PER_INCH_CORRECTED_RENDER_TARGET}
			<br />&#9;ROUND_UP_DOTS_PER_INCH: ${pipeline.ROUND_UP_DOTS_PER_INCH}
			<br />&#9;ALLOW_NORMAL_MAPS (f3): ${tileform.ALLOW_NORMAL_MAPS}
			<br />fps: ${glob.fps?.toFixed(2)} ${glob.delta?.toFixed(3)}
			<br />render scale (-, =): ${glob.scale}
			<br />zoom scale (r, f): ${zoom.scale()}
			<br />grid (t, g): ${rome.world.grid.spread} / ${rome.world.grid.outside}
			<br />glob.rerender: ${glob.rerender}
			<br />glob.rerenderObjects: ${glob.rerenderObjects}
			<!--<br />cameraMode: ${pipeline.cameraMode}-->
			<br />chunk_span: ${clod.chunk_span} x ${clod.chunk_span}
			<br />gobjs: ${glob.gameobjects[0]} / ${glob.gameobjects[1]}
			<br />chunks: ${clod.numbers.chunks[0]} / ${clod.numbers.chunks[1]}
			`;
    }
    function purgeRemake() {
        const chunks = clod.helpers.get_every_chunk(rome.world);
        for (const chunk of chunks) {
            chunk.nuke();
        }
        rome.world = clod.init();
        gameObjects.forEach(gobj => { gobj.purge(); removeGobj(gobj); });
        gameObjects = [];
        glob.rerender = true;
        glob.rerenderObjects = true;
        makeTestingChamber();
    }
    rome.purgeRemake = purgeRemake;
    function step() {
        hooks.emit('romeComponents', 1);
        hooks.emit('romeStep', 0);
        debgkeys();
        build_then_output_stats();
        rome.world.update(pan.wpos);
        glob.rerender = false;
    }
    rome.step = step;
    function debgkeys() {
        if (app.key('c') == 1) {
            const chunks = clod.helpers.get_every_chunk(rome.world);
            console.log('chunks', chunks);
        }
        if (app.key('a') == 1) {
            console.log('arrays', rome.world.arrays);
        }
        if (app.key('t') == 1) {
            rome.world.grid.shrink();
        }
        if (app.key('g') == 1) {
            rome.world.grid.grow();
        }
        if (app.key('[') == 1) {
            tileform.hex_size -= .1;
            console.log(tileform.hex_size);
            purgeRemake();
        }
        if (app.key(']') == 1) {
            tileform.hex_size += .1;
            console.log(tileform.hex_size);
            purgeRemake();
        }
        if (app.key('-') == 1) {
            if (glob.scale > 1)
                glob.scale -= 1;
            console.log(glob.scale);
            purgeRemake();
        }
        if (app.key('=') == 1) {
            glob.scale += 1;
            console.log(glob.scale);
            purgeRemake();
        }
        if (app.key(',') == 1) {
            tileform.HexRotationY -= .005;
            console.log(tileform.HexRotationY);
            purgeRemake();
        }
        if (app.key('.') == 1) {
            tileform.HexRotationY += .005;
            console.log(tileform.HexRotationY);
            purgeRemake();
        }
        if (app.key('n') == 1) {
            tileform.HexRotationX -= .01;
            console.log(tileform.HexRotationX);
            purgeRemake();
        }
        if (app.key('m') == 1) {
            tileform.HexRotationX += .01;
            console.log(tileform.HexRotationX);
            purgeRemake();
        }
    }
})(rome || (rome = {}));
export default rome;
