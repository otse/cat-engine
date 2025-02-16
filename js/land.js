import tile3d from "./core/objects/tile 3d.js";
import rome from "./rome.js";
/// generates land
// https://github.com/josephg/noisejs
var land;
(function (land) {
    function init() {
    }
    land.init = init;
    function make() {
        // woo
        noise.seed(26); // 1 to 65536
        const gobjs = [];
        const baseWidth = 100;
        const baseHeight = 100;
        const width = 10;
        const height = 10;
        for (let y = 0; y < baseWidth; y++) {
            for (let x = 0; x < baseHeight; x++) {
                const point = noise.simplex2(x / width, y / height);
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
                        _wpos: [(-baseWidth / 2) + x, (-baseHeight / 2) + y, 0]
                    }, tilePreset);
                    gobjs.push(tile);
                }
            }
        }
        rome.addLateGobjsBatch(gobjs, 'merge');
    }
    land.make = make;
})(land || (land = {}));
export default land;
