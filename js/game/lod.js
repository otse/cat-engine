import aabb2 from "../lib/aabb2";
import pts from "../lib/pts";
import rome from "../rome";
import { hooks } from "../lib/hooks";
import pipeline from "./pipeline";
export var numbers;
(function (numbers) {
    numbers.sectors = [0, 0];
    numbers.sprites = [0, 0];
    numbers.objs = [0, 0];
})(numbers || (numbers = {}));
;
class toggle {
    active = false;
    isActive() { return this.active; }
    ;
    on() {
        if (this.active) {
            // console.warn(' (toggle) already on ');
            return true;
            // it was on before
        }
        this.active = true;
        return false;
        // it wasn't on before
    }
    off() {
        if (!this.active) {
            // console.warn(' (toggle) already off ');
            return true;
        }
        this.active = false;
        return false;
    }
}
var lod;
(function (lod) {
    const chunk_coloration = false;
    const fog_of_war = false;
    const grid_crawl_makes_sectors = true;
    const size = 8;
    lod.SectorSpan = 2;
    lod.stamp = 0; // used only by server slod
    function register() {
        // hooks.create('sectorCreate')
        // hooks.create('sectorShow')
        // hooks.create('sectorHide')
        // hooks.register('sectorHide', () => { console.log('~'); return false; } );
    }
    lod.register = register;
    function project(unit) {
        return pts.mult(pts.project(unit), rome.size);
    }
    lod.project = project;
    function unproject(pixel) {
        return pts.divide(pts.unproject(pixel), rome.size);
    }
    lod.unproject = unproject;
    function add(obj) {
        let sector = lod.gworld.at(lod.world.big(obj.wpos));
        sector.add(obj);
    }
    lod.add = add;
    function remove(obj) {
        obj.sector?.remove(obj);
    }
    lod.remove = remove;
    class world {
        arrays = [];
        constructor(span) {
            lod.gworld = this;
            new grid(2, 2);
        }
        update(wpos) {
            lod.ggrid.big = lod.world.big(wpos);
            lod.ggrid.ons();
            lod.ggrid.offs();
        }
        lookup(big) {
            if (this.arrays[big[1]] == undefined)
                this.arrays[big[1]] = [];
            return this.arrays[big[1]][big[0]];
        }
        at(big) {
            return this.lookup(big) || this.make(big);
        }
        make(big) {
            let s = this.lookup(big);
            if (s)
                return s;
            s = this.arrays[big[1]][big[0]] = new sector(big, this);
            return s;
        }
        static big(units) {
            return pts.floor(pts.divide(units, lod.SectorSpan));
        }
    }
    lod.world = world;
    class sector extends toggle {
        big;
        world;
        group;
        color;
        fog_of_war = false;
        small;
        objs = [];
        constructor(big, world) {
            super();
            this.big = big;
            this.world = world;
            if (chunk_coloration)
                this.color = (['lightsalmon', 'lightblue', 'beige', 'pink'])[Math.floor(Math.random() * 4)];
            let min = pts.mult(this.big, lod.SectorSpan);
            let max = pts.add(min, [lod.SectorSpan - 1, lod.SectorSpan - 1]);
            this.small = new aabb2(max, min);
            this.group = new THREE.Group;
            this.group.frustumCulled = false;
            this.group.matrixAutoUpdate = false;
            numbers.sectors[1]++;
            world.arrays[this.big[1]][this.big[0]] = this;
            //console.log('sector');
            hooks.call('sectorCreate', this);
        }
        add(obj) {
            let i = this.objs.indexOf(obj);
            if (i == -1) {
                this.objs.push(obj);
                obj.sector = this;
                if (this.isActive() && !obj.isActive())
                    obj.show();
            }
        }
        stacked(wpos) {
            let stack = [];
            for (let obj of this.objs)
                if (pts.equals(wpos, pts.round(obj.wpos)))
                    stack.push(obj);
            return stack;
        }
        remove(obj) {
            let i = this.objs.indexOf(obj);
            if (i > -1) {
                obj.sector = null;
                return !!this.objs.splice(i, 1).length;
            }
        }
        static swap(obj) {
            // Call me whenever you move
            let oldSector = obj.sector;
            let newSector = oldSector.world.at(lod.world.big(pts.round(obj.wpos)));
            if (oldSector != newSector) {
                oldSector.remove(obj);
                newSector.add(obj);
                if (!newSector.isActive())
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
            numbers.sectors[0]++;
            for (let obj of this.objs)
                obj.show();
            pipeline.scene.add(this.group);
            hooks.call('sectorShow', this);
        }
        hide() {
            if (this.off())
                return;
            numbers.sectors[0]--;
            for (let obj of this.objs)
                obj.hide();
            pipeline.scene.remove(this.group);
            hooks.call('sectorHide', this);
        }
        dist() {
            return pts.distsimple(this.big, lod.ggrid.big);
        }
        grayscale() {
            this.color = 'gray';
        }
    }
    lod.sector = sector;
    class grid {
        spread;
        outside;
        big = [0, 0];
        shown = [];
        visibleObjs = [];
        constructor(spread, outside) {
            this.spread = spread;
            this.outside = outside;
            lod.ggrid = this;
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
                    let pos = pts.add(this.big, [x, y]);
                    let sector = grid_crawl_makes_sectors ? lod.gworld.at(pos) : lod.gworld.lookup(pos);
                    if (!sector)
                        continue;
                    if (!sector.isActive()) {
                        this.shown.push(sector);
                        sector.show();
                        for (let obj of sector.objs)
                            obj.tick();
                    }
                }
            }
        }
        offs() {
            // Hide sectors
            this.visibleObjs = [];
            let i = this.shown.length;
            while (i--) {
                let sector;
                sector = this.shown[i];
                if (sector.dist() > this.outside) {
                    sector.hide();
                    this.shown.splice(i, 1);
                }
                else {
                    sector.tick();
                    this.visibleObjs = this.visibleObjs.concat(sector.objs);
                }
                if (fog_of_war) {
                    if (sector.dist() == this.outside) {
                        //console.log('brim-chunk');
                        sector.fog_of_war = true;
                        //sector.color = '#555555';
                    }
                    else {
                        sector.fog_of_war = false;
                        //sector.color = '#ffffff';
                    }
                }
            }
        }
        ticks() {
            for (let sector of this.shown)
                for (let obj of sector.objs)
                    obj.tick();
        }
    }
    lod.grid = grid;
    ;
    class obj extends toggle {
        counts;
        id = -1;
        type = 'an obj';
        networked = false;
        solid = false;
        wpos = [0, 0];
        rpos = [0, 0];
        size = [100, 100];
        //subsize: vec2 = [0, 0]
        shape;
        sector;
        ro = 0;
        z = 0; // z is only used by tiles
        calcz = 0;
        height = 0;
        bound;
        expand = .5;
        constructor(counts = numbers.objs) {
            super();
            this.counts = counts;
            this.counts[1]++;
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
            this.obj_manual_update();
            this.shape?.show();
        }
        hide() {
            if (this.off())
                return;
            this.counts[0]--;
            //this.delete();
            this.shape?.hide();
            // console.log(' obj.hide ');
        }
        rebound() {
            this.bound = new aabb2([-this.expand, -this.expand], [this.expand, this.expand]);
            this.bound.translate(this.wpos);
        }
        wtorpos() {
            this.rpos = lod.project(this.wpos);
        }
        rtospos() {
            this.wtorpos();
            return pts.clone(this.rpos);
        }
        tick() {
            // implement me
        }
        create() {
            // implement me
            // typically used to create a sprite
            console.warn(' (lod) obj.create ');
        }
        // delete is never used
        delete() {
            // implement me
            // console.warn(' (lod) obj.delete ');
        }
        obj_manual_update() {
            // implement me
            this.wtorpos();
            this.shape?.shape_manual_update();
        }
        is_type(types) {
            return types.indexOf(this.type) != -1;
        }
    }
    lod.obj = obj;
    ;
    class shape extends toggle {
        bindObj;
        counts;
        constructor(bindObj, counts) {
            super();
            this.bindObj = bindObj;
            this.counts = counts;
            this.bindObj.shape = this;
            this.counts[1]++;
        }
        shape_manual_update() {
        }
        create() {
        }
        dispose() {
        }
        finalize() {
            // this.hide();
            this.counts[1]--;
            this.bindObj.shape = null;
            //console.warn('finalize!');
        }
        show() {
            if (this.on())
                return;
            this.create();
            this.counts[0]++;
        }
        hide() {
            if (this.off())
                return;
            this.dispose();
            this.finalize();
            this.counts[0]--;
        }
    }
    lod.shape = shape;
})(lod || (lod = {}));
export default lod;
