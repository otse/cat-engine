import aabb2 from "../dep/aabb2.js";
import pts from "../dep/pts.js";
import hooks from "../dep/hooks.js";
import ren from "./pipeline.js";
import toggle from "../dep/toggle.js";
export var numbers;
(function (numbers) {
    numbers.chunks = [0, 0];
    numbers.objs = [0, 0];
    numbers.sprites = [0, 0];
    numbers.tiles = [0, 0];
    numbers.walls = [0, 0];
})(numbers || (numbers = {}));
;
var clod;
(function (clod) {
    clod.size = 9;
    const chunk_coloration = false;
    const fog_of_war = false;
    const grid_crawl_makes_chunks = true;
    clod.SectorSpan = 2;
    clod.stamp = 0; // used only by server slod
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
        return pts.mult(pts.project(unit), 1);
    }
    clod.project = project;
    function unproject(pixel) {
        return pts.divide(pts.unproject(pixel), 1);
    }
    clod.unproject = unproject;
    function add(world, obj) {
        if (!obj)
            return;
        let chunk = world.atwpos(obj.wpos);
        chunk.add(obj);
    }
    clod.add = add;
    function remove(obj) {
        obj.chunk?.remove(obj);
    }
    clod.remove = remove;
    class world {
        // The client lod only has a single observer
        // If you need more, decouple it then make sure that
        // the grid does not start showing and hiding chunks 
        grid;
        arrays = [];
        constructor(useless_value) {
            new grid(this, 2, 2);
        }
        update(wpos) {
            this.grid.cpos = clod.world.cpos(wpos);
            this.grid.ons();
            this.grid.offs();
        }
        lookup(big) {
            if (this.arrays[big[1]] == undefined)
                this.arrays[big[1]] = [];
            return this.arrays[big[1]][big[0]];
        }
        at(cpos) {
            return this.lookup(cpos) || this._make(cpos);
        }
        atwpos(wpos) {
            return this.at(world.cpos(wpos));
        }
        _make(cpos) {
            let s = this.lookup(cpos);
            if (s)
                return s;
            s = this.arrays[cpos[1]][cpos[0]] = new chunk(cpos, this);
            return s;
        }
        static cpos(units) {
            return pts.floor(pts.divide(units, clod.SectorSpan));
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
            let min = pts.mult(this.cpos, clod.SectorSpan);
            let max = pts.add(min, [clod.SectorSpan - 1, clod.SectorSpan - 1]);
            this.small = new aabb2(max, min);
            this.group = new THREE.Group;
            this.group.frustumCulled = false;
            this.group.matrixAutoUpdate = false;
            numbers.chunks[1]++;
            world.arrays[this.cpos[1]][this.cpos[0]] = this;
            //console.log('sector');
            hooks.call('sectorCreate', this);
        }
        add(obj) {
            if (!this.objs.includes(obj)) {
                this.objs.push(obj);
                obj.chunk = this;
                if (this.active)
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
        stacked(wpos) {
            let stack = [];
            for (let obj of this.objs)
                if (pts.equals(wpos, pts.round(obj.wpos)))
                    stack.push(obj);
            return stack;
        }
        static swap(obj) {
            // Call me whenever you move
            let oldChunk = obj.chunk;
            let newChunk = oldChunk.world.atwpos(/*pts.round(*/ obj.wpos /*)*/);
            // the pts.round causes an impossible to find bug
            if (oldChunk != newChunk) {
                oldChunk.remove(obj);
                newChunk.add(obj);
                if (!newChunk.active)
                    obj.hide();
            }
        }
        tick() {
            hooks.call('sectorTick', this);
            //for (let obj of this.objs)
            //	obj.tick();
        }
        show() {
            if (this.on())
                return;
            numbers.chunks[0]++;
            for (const obj of this.objs)
                obj.show();
            ren.scene.add(this.group);
            hooks.call('sectorShow', this);
        }
        hide() {
            if (this.off())
                return;
            numbers.chunks[0]--;
            for (let obj of this.objs)
                obj.hide();
            ren.scene.remove(this.group);
            hooks.call('sectorHide', this);
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
        visible(sector) {
            return sector.dist() < this.spread;
        }
        ons() {
            // spread = -2; < 2
            for (let y = -this.spread; y < this.spread + 1; y++) {
                for (let x = -this.spread; x < this.spread + 1; x++) {
                    let pos = pts.add(this.cpos, [x, y]);
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
                    if (chunk.dist() == this.outside) {
                        //console.log('brim-chunk');
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
        }
        show() {
            if (this.on())
                return;
            this.counts[0]++;
            this.create();
            this.step(); // Cursor fixed the bug
            //this.shape?.show();
        }
        hide() {
            if (this.off())
                return;
            this.counts[0]--;
            this.delete();
            //this.shape?.hide();
            // console.log(' obj.hide ');
        }
        rebound() {
            this.bound = new aabb2([-this.expand, -this.expand], [this.expand, this.expand]);
            this.bound.translate(this.wpos);
        }
        wtorpos() {
            this.rpos = clod.project(this.wpos);
        }
        rtospos() {
            this.wtorpos();
            return pts.copy(this.rpos);
        }
        create() {
            this._create();
        }
        delete() {
            this._delete();
        }
        step() {
            this._step();
        }
        _create() {
            console.warn('obj.create');
        }
        _delete() {
        }
        _step() {
            this.wtorpos();
            this.rebound();
        }
    }
    clod.obj = obj;
})(clod || (clod = {}));
export default clod;
