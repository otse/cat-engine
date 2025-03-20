import aabb2 from "../dep/aabb2.js";
import glob from "./../dep/glob.js";
import pts from "../dep/pts.js";
import { hooks } from "../dep/hooks.js";
import pipeline from "./pipeline.js"; // Begone!
import toggle from "../dep/toggle.js";
var clod;
(function (clod) {
    const chunk_coloration = false;
    const fog_of_war = false;
    const grid_crawl_makes_chunks = false;
    clod.chunk_span = 3;
    // For slod
    // export var stamp = 0;
    function init() {
        console.log('init');
        const world = new clod.world(10);
        return world;
    }
    clod.init = init;
    function register() {
        // hooks.create('sectorCreate')
        // hooks.create('sectorShow')
        // hooks.create('sectorHide')
        // hooks.register('sectorHide', () => { console.log('~'); return false; } );
    }
    clod.register = register;
    function project(unit) {
        return (pts.mult(pts.project(unit), glob.scale));
    }
    clod.project = project;
    function unproject(pixel) {
        return (pts.divide(pts.unproject(pixel), glob.scale));
    }
    clod.unproject = unproject;
    function add(world, obj) {
        if (!obj)
            return;
        world.chunkatwpos(obj.wpos).add(obj);
    }
    clod.add = add;
    function addWait(world, obj) {
        // So we wait til all objs are lodded
        if (!obj)
            return;
        world.chunkatwpos(obj.wpos).add(obj, false);
    }
    clod.addWait = addWait;
    function remove(obj) {
        obj.chunk?.remove(obj);
    }
    clod.remove = remove;
    class world {
        // By design the c lod only has a single observer
        // If you need more grids, for filtering purposes
        // or for creating larger or smaller skirts,
        // decouple the grid from the world here
        // then make sure the optional grids don't hide or show chunks 
        grid;
        arrays = [];
        constructor(useless_value) {
            this.grid = new grid(this, 2, 2);
        }
        update(wpos) {
            this.grid.cpos = clod.world.wtocpos(wpos);
            this.grid.ons();
            this.grid.offs();
            this.grid.ticks();
        }
        lookup(big) {
            if (this.arrays[big[1]] == undefined)
                this.arrays[big[1]] = [];
            return this.arrays[big[1]][big[0]];
        }
        at(cpos) {
            return this.lookup(cpos) || this._make(cpos);
        }
        chunkatwpos(wpos) {
            return this.at(world.wtocpos(wpos));
        }
        _make(cpos) {
            let ch = this.lookup(cpos);
            if (ch)
                return ch;
            return this.arrays[cpos[1]][cpos[0]] = new chunk(cpos, this);
        }
        static wtocpos(w) {
            return (pts.floor(pts.divide(w, clod.chunk_span)));
        }
    }
    clod.world = world;
    class chunk extends toggle {
        cpos;
        world;
        group;
        color;
        fog_of_war = false;
        small;
        objs = [];
        constructor(cpos, world) {
            super();
            this.cpos = cpos;
            this.world = world;
            if (chunk_coloration)
                this.color = (['lightsalmon', 'lightblue', 'beige', 'pink'])[Math.floor(Math.random() * 4)];
            let min = (pts.mult(this.cpos, clod.chunk_span));
            let max = (pts.add(min, [clod.chunk_span - 1, clod.chunk_span - 1]));
            this.small = new aabb2(max, min);
            this.group = new THREE.Group;
            this.group.frustumCulled = false;
            this.group.matrixAutoUpdate = false;
            numbers.chunks[1]++;
            world.arrays[this.cpos[1]][this.cpos[0]] = this;
            //console.log('sector');
            hooks.emit('chunkCreate', this);
        }
        nuke() {
            numbers.chunks[1]--;
            this.hide();
            for (const obj of this.objs) {
                obj.finalize();
            }
            this.objs.splice(0, this.objs.length);
            this.objs.length = 0;
        }
        add(obj, show = true) {
            if (this.objs.includes(obj) == false) {
                this.objs.push(obj);
                obj.chunk = this;
                if (this.active && show)
                    obj.show();
            }
        }
        remove(obj) {
            let i = this.objs.indexOf(obj);
            if (i > -1) {
                obj.chunk = null;
                return !!this.objs.splice(i, 1).length;
            }
        }
        // Get all things at one point
        objsatwpos(wpos) {
            const stack = [];
            for (const obj of this.objs)
                if (pts.equals(pts.round(wpos), pts.round(obj.wpos)))
                    stack.push(obj);
            return stack;
        }
        static swap(obj) {
            // Call me whenever you move
            let oldChunk = obj.chunk;
            let newChunk = oldChunk.world.chunkatwpos(/*pts.round(*/ obj.wpos /*)*/);
            // the pts.round causes an impossible to find bug
            if (oldChunk != newChunk) {
                oldChunk.remove(obj);
                newChunk.add(obj);
                if (!newChunk.active)
                    obj.hide();
            }
        }
        tick() {
            hooks.emit('chunkTick', this);
            //for (let obj of this.objs)
            //	obj.tick();
        }
        show() {
            if (this.on())
                return;
            numbers.chunks[0]++;
            for (const obj of this.objs)
                obj.show();
            pipeline.scene.add(this.group);
            hooks.emit('chunkShow', this);
        }
        hide() {
            if (this.off())
                return;
            numbers.chunks[0]--;
            for (const obj of this.objs)
                obj.hide();
            pipeline.scene.remove(this.group);
            hooks.emit('chunkHide', this);
        }
        dist() {
            return pts.distsimple(this.cpos, this.world.grid.cpos);
        }
        grayscale() {
            this.color = 'gray';
        }
    }
    clod.chunk = chunk;
    class grid {
        world;
        spread;
        outside;
        cpos = [0, 0];
        shown = [];
        visibleObjs = [];
        constructor(world, spread, outside) {
            this.world = world;
            this.spread = spread;
            this.outside = outside;
            if (this.outside < this.spread) {
                console.warn(' outside less than spread ', this.spread, this.outside);
                this.outside = this.spread;
            }
        }
        grow() {
            this.spread++;
            this.outside++;
        }
        shrink() {
            this.spread--;
            this.outside--;
        }
        visible(chunk) {
            return chunk.dist() < this.spread;
        }
        ons() {
            // spread = -2; < 2
            for (let y = -this.spread; y < this.spread + 1; y++) {
                for (let x = -this.spread; x < this.spread + 1; x++) {
                    let pos = (pts.add(this.cpos, [x, y]));
                    let chunk = grid_crawl_makes_chunks ? this.world.at(pos) : this.world.lookup(pos);
                    if (!chunk)
                        continue;
                    if (!chunk.active) {
                        this.shown.push(chunk);
                        chunk.show();
                        // console.log(' show ');
                        // todo why
                        // for (let obj of sector.objs)
                        // obj.step();
                    }
                }
            }
        }
        offs() {
            // Hide sectors
            this.visibleObjs = [];
            let i = this.shown.length;
            while (i--) {
                let chunk;
                chunk = this.shown[i];
                if (chunk.dist() > this.outside) {
                    chunk.hide();
                    this.shown.splice(i, 1);
                }
                else {
                    chunk.tick();
                    this.visibleObjs = this.visibleObjs.concat(chunk.objs);
                }
                if (fog_of_war) {
                    if (chunk.dist() >= this.outside) { // == outside or => ?
                        chunk.fog_of_war = true;
                        //sector.color = '#555555';
                    }
                    else {
                        chunk.fog_of_war = false;
                        //sector.color = '#ffffff';
                    }
                }
            }
        }
        ticks() {
            for (const chunk of this.shown)
                for (const obj of chunk.objs)
                    obj.step();
        }
    }
    clod.grid = grid;
    ;
    class obj extends toggle {
        counts;
        static ids = 0;
        id = -1;
        wpos = [0, 0];
        rpos = [0, 0];
        size = [64, 64];
        chunk;
        bound;
        expand = .5;
        constructor(counts = numbers.objs) {
            super();
            this.counts = counts;
            this.counts[1]++;
            this.id = obj.ids++;
        }
        finalize() {
            // this.hide();
            this.counts[1]--;
            this.hide();
        }
        show() {
            if (this.on())
                return;
            this.counts[0]++;
            this._create();
            this.step();
            //this.shape?.show();
        }
        hide() {
            if (this.off())
                return;
            this.counts[0]--;
            this._delete();
            //this.shape?.hide();
            // console.log(' obj.hide ');
        }
        rebound() {
            this.bound = new aabb2([-this.expand, -this.expand], [this.expand, this.expand]);
            this.bound.translate(this.wpos);
        }
        wtorpos() {
            this.rpos = (clod.project(this.wpos));
            this.rpos = pts.floor(this.rpos);
        }
        rtospos() {
            this.wtorpos();
            return pts.copy(this.rpos);
        }
        //create() { // Use show() instead!
        //	this._create();
        //}
        // delete() { // Use hide() instead!
        //	this._delete();
        //}
        step() {
            this._step();
        }
        _create() {
            console.warn(' empty create ');
        }
        _delete() {
        }
        // Todo,
        // Flag the Rpos as unclean when the Wpos is changed
        // using getters and setters?
        _step() {
            this.wtorpos();
            this.rebound();
        }
    }
    clod.obj = obj;
    let helpers;
    (function (helpers) {
        function get_every_chunk(world) {
            let chunks = [];
            for (const i in world.arrays) {
                for (const j in world.arrays[i]) {
                    chunks.push(world.arrays[i][j]);
                }
            }
            return chunks;
        }
        helpers.get_every_chunk = get_every_chunk;
        // Build a directional "matrix" of game objects
        function get_matrix(world, center) {
            const directions = [
                [-1, 1], [0, 1], [1, 1],
                [-1, 0], [0, 0], [1, 0],
                [-1, -1], [0, -1], [1, -1]
            ];
            let matrix = [];
            directions.forEach((pos, index) => {
                pos = (pts.add(pos, center));
                matrix[index] = world.chunkatwpos(pos).objsatwpos(pos);
            });
            return matrix;
        }
        helpers.get_matrix = get_matrix;
    })(helpers = clod.helpers || (clod.helpers = {}));
    let numbers;
    (function (numbers) {
        numbers.chunks = [0, 0];
        numbers.objs = [0, 0];
        numbers.sprites = [0, 0];
        numbers.tiles = [0, 0];
        numbers.walls = [0, 0];
    })(numbers = clod.numbers || (clod.numbers = {}));
    ;
})(clod || (clod = {}));
export default clod;
