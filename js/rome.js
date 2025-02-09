import app from "./app.js";
import { hooks } from "./dep/hooks.js";
import pipeline from "./core/pipeline.js";
import tileform from "./core/tileform.js";
import tile from "./core/objects/tile.js";
import tile3d from "./core/objects/tile 3d.js";
import wall from "./core/objects/wall.js";
import wall3d from "./core/objects/wall 3d.js";
import zoom from "./core/components/zoom.js";
import pan from "./core/components/pan.js";
import game_object from "./core/objects/game object.js";
import clod from "./core/clod.js";
import glob from "./dep/glob.js";
import land from "./land.js";
import romanlike from "./romanlike/romanlike.js";
var rome;
(function (rome) {
    rome.tileSize = [17, 9]; // glob?
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
        glob.prerender = true;
        glob.scale = 1;
        await preload_basic_textures();
        await pipeline.init();
        await tileform.init();
        romanlike.init();
        land.init();
        rome.world = clod.init();
        app;
        makeTestingChamber();
        land.make();
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
        // Parameter injection
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
    }
    function makeTestingChamber() {
        let gobjs = [];
        function collect(gobj) {
            gobjs.push(gobj);
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
        collect(new tile({ _type: 'direct', colorOverride: 'orange', _wpos: [1, -1, 0] }));
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
        collect(new tile({ _type: 'direct', _wpos: [7, 0, 0] }));
        collect(new wall3d({ _type: 'direct', _wpos: [2, 1, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'magenta', _wpos: [3, 1, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'pink', _wpos: [3, 2, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'blue', _wpos: [3, 3, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'red', _wpos: [4, 3, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'purple', _wpos: [5, 3, 0] }));
        collect(new tile({ _type: 'direct', _wpos: [4, 2, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'magenta', _wpos: [1, 2, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'pink', _wpos: [1, 3, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'blue', _wpos: [1, 4, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'red', _wpos: [1, 5, 0] }));
        collect(new wall3d({ _type: 'direct', colorOverride: 'purple', _wpos: [1, 6, 0] }));
        collect(new wall({ _type: 'direct', _wpos: [4, 1, 0] }));
        collect(new wall({ _type: 'direct', _wpos: [5, 1, 0] }));
        // This is stupid
        addLateGobjsBatch(gobjs, 'keep');
        land.make();
    }
    function step() {
        hooks.emit('romeComponents', 1);
        hooks.emit('romeStep', 0);
        // Todo fix this double update
        rome.world.update(pan.wpos);
        rome.world.grid.ticks();
        const remakeObjects = () => {
            game_object._gameObjects.forEach(gobj => gobj.purge());
            game_object._gameObjects = [];
            makeTestingChamber();
        };
        if (app.key('[') == 1) {
            tileform.hex_size -= .1;
            console.log(tileform.hex_size);
            remakeObjects();
        }
        if (app.key(']') == 1) {
            tileform.hex_size += .1;
            console.log(tileform.hex_size);
            remakeObjects();
        }
        if (app.key('-') == 1) {
            if (glob.scale > 1)
                glob.scale -= 1;
            console.log(glob.scale);
            remakeObjects();
        }
        if (app.key('=') == 1) {
            glob.scale += 1;
            console.log(glob.scale);
            remakeObjects();
        }
        if (app.key(',') == 1) {
            tileform.HexRotationY -= .005;
            console.log(tileform.HexRotationY);
            remakeObjects();
        }
        if (app.key('.') == 1) {
            tileform.HexRotationY += .005;
            console.log(tileform.HexRotationY);
            remakeObjects();
        }
        if (app.key('n') == 1) {
            tileform.HexRotationX -= .01;
            console.log(tileform.HexRotationX);
            remakeObjects();
        }
        if (app.key('m') == 1) {
            tileform.HexRotationX += .01;
            console.log(tileform.HexRotationX);
            remakeObjects();
        }
        glob.rerender = false;
    }
    rome.step = step;
})(rome || (rome = {}));
export default rome;
