import app from "./app.js";
import sprite from "./game/sprite.js";
import { hooks } from "./lib/hooks.js";
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
        new sprite({ size: [12, 8] });
    }
    rome.init = init;
    function step() {
        hooks.emit('romeStep', 0);
    }
    rome.step = step;
})(rome || (rome = {}));
export default rome;
