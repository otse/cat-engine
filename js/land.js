import tile3d from "./game/objects/tile 3d.js";
import rome from "./rome.js";
/// generates land
var land;
(function (land) {
    function init() {
    }
    land.init = init;
    function make() {
        // lets make some things!
        const point = perlin.get(0, 1);
        const gobjs = [];
        for (let y = 0; y < 100; y++) {
            for (let x = 0; x < 100; x++) {
                const tile = new tile3d({ _type: 'direct', colorOverride: 'pink', _wpos: [-50 + x, -50 + y, 0] });
                gobjs.push(tile);
            }
        }
        rome.addLateGobjs(gobjs, 'merge');
    }
    land.make = make;
})(land || (land = {}));
export default land;
