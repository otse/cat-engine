import tile3d from "../core/objects/tile 3d.js";
import world_manager from "../core/world manager.js";
import aabb2 from "../dep/aabb2.js";
import pts from "../dep/pts.js";
import staggered_area from "../core/staggered area.js";
import wall3d from "../core/objects/wall 3d.js";
/// generates land
// https://github.com/josephg/noisejs
var land;
(function (land) {
    function init() {
        // Does nothing!
    }
    land.init = init;
    class perlin_area {
        scale;
        // perlin does not repeat but is repeatable
        constructor(seed, scale) {
            this.scale = scale;
            this._set(seed);
        }
        _set(seed) {
            noise.seed(seed);
        }
        get_simplex2(x, y) {
            const point = noise.simplex2(x / this.scale[0], y / this.scale[1]);
            return point;
        }
    }
    function repopulate() {
        make();
        make_staggered_building();
        make_non_staggered_lake();
    }
    land.repopulate = repopulate;
    function make() {
        // woo
        noise.seed(28); // 1 to 65536
        const objects = [];
        const populate = [100, 100];
        const area = new perlin_area(28, [10, 10]);
        for (let y = 0; y < populate[0]; y++) {
            for (let x = 0; x < populate[1]; x++) {
                const point = area.get_simplex2(x, y);
                let tilePreset = 'default';
                if (point < 0) {
                    if (point < -0.6) {
                        tilePreset = 'cobblestone';
                    }
                    else if (point < -0.3) {
                        tilePreset = 'stonemixed';
                    }
                    const tile = new tile3d({
                        _type: 'direct',
                        _wpos: [(-populate[0] / 2) + x, (-populate[1] / 2) + y, 0]
                    }, tilePreset);
                    objects.push(tile);
                }
            }
        }
        world_manager.add_multiple(objects, 1);
    }
    function make_staggered_building() {
        const objects = [];
        const pos = [8, 0];
        const size = [5, 5];
        const aabb = new aabb2(pos, pts.add(pos, size));
        const staggeredArea = new staggered_area(aabb2.area(aabb));
        // staggeredArea._stagger();
        staggeredArea.do((point) => {
            if (point.isBorder) {
                const wall = new wall3d({
                    _type: 'direct',
                    _wpos: [point.pos[0], point.pos[1], 0],
                    extra: { staggerData: point },
                    // colorOverride: 'green'
                }, 'elven');
                const tile = new tile3d({
                    _type: 'direct',
                    _wpos: [point.pos[0], point.pos[1], 0]
                }, 'star');
                objects.push(wall);
                objects.push(tile);
            }
            else {
                const tile = new tile3d({
                    _type: 'direct',
                    _wpos: [point.pos[0], point.pos[1], 0]
                }, 'star');
                objects.push(tile);
            }
        });
        world_manager.add_multiple(objects, 1);
    }
    function make_non_staggered_lake() {
        const objects = [];
        const pos = [8, 8];
        const size = [5, 5];
        const aabb = new aabb2(pos, pts.add(pos, size));
        const area = aabb2.area(aabb);
        area.do((point) => {
            if (point.isBorder) {
                const wall = new wall3d({
                    _type: 'direct',
                    _wpos: [point.pos[0], point.pos[1], 0]
                    // colorOverride: 'green'
                }, 'basalt');
                objects.push(wall);
            }
            else {
                const tile = new tile3d({
                    _type: 'direct',
                    _wpos: [point.pos[0], point.pos[1], 0]
                }, 'water');
                objects.push(tile);
            }
        });
        world_manager.add_multiple(objects, 2);
    }
    function test_fill() {
        const gobjs = [];
        const baseWidth = 100;
        const baseHeight = 100;
        const width = 10;
        const height = 10;
        for (let y = 0; y < baseWidth; y++) {
            for (let x = 0; x < baseHeight; x++) {
                let tilePreset = 'default'; // rome.sample(['default', 'cobblestone', 'stonemixed']);
                const tile = new tile3d({
                    _type: 'direct',
                    _wpos: [(-baseWidth / 2) + x, (-baseHeight / 2) + y, 0]
                }, tilePreset);
                gobjs.push(tile);
            }
        }
        world_manager.add_multiple(gobjs, 1);
    }
    land.test_fill = test_fill;
    function make_bodies_of_water() {
        noise.seed(29); // 1 to 65536
    }
    land.make_bodies_of_water = make_bodies_of_water;
})(land || (land = {}));
export default land;
