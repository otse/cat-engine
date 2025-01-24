import { hooks } from "../../dep/hooks.js";
import app from "../../app.js";
import pipeline from "../pipeline.js";
var zoom;
(function (zoom) {
    let level = 0;
    zoom.zooms = [1, 0.5, 0.33, 0.2, 0.1, 0.05, 0.025, 0.01];
    function register() {
        hooks.addListener('romeComponents', step);
    }
    zoom.register = register;
    function actualZoom() {
        return zoom.zooms[level];
    }
    zoom.actualZoom = actualZoom;
    async function step() {
        //console.log('zoom step');
        if (app.wheel == -1) {
            console.log('app wheel');
            level = (level > 0) ? level - 1 : level;
        }
        if (app.wheel == 1) {
            console.log('app wheel');
            level = (level < zoom.zooms.length - 1) ? level + 1 : level;
        }
        const scale = zoom.zooms[level];
        pipeline.camera.scale.set(scale, scale, scale);
        return false;
    }
})(zoom || (zoom = {}));
export default zoom;
