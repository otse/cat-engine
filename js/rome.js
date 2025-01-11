import app from "./app.js";
import { hooks } from "./lib/hooks.js";
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
    function init() {
        console.log(' init ');
        app;
    }
    rome.init = init;
    function step() {
        hooks.emit('romeStep', 0);
    }
    rome.step = step;
})(rome || (rome = {}));
export default rome;
