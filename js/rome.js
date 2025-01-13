import app from "./app.js";
import { hooks } from "./lib/hooks.js";
import tile from "./game/objects/tile.js";
import zoom from "./game/components/zoom.js";
import bettertile from "./game/objects/better tile.js";
var rome;
(function (rome) {
    rome.size = 8;
    function sample(a) {
        return a[Math.floor(Math.random() * a.length)];
    }
    rome.sample = sample;
    function clamp(val, min, max) {
        return val > max ? max : val < min ? min : val;
    }
    rome.clamp = clamp;
    function init() {
        console.log(' init ');
        app;
        zoom.register();
        new tile({ _wpos: [0, 0, 0] });
        new bettertile({ name: 'ass', _wpos: [1, 0, 0] });
        new bettertile({ _type: 'wall', _wpos: [1, 1, 0] });
        //new sprite({ size: [12, 8] });
    }
    rome.init = init;
    function step() {
        hooks.emit('romeStep', 0);
    }
    rome.step = step;
})(rome || (rome = {}));
export default rome;
