import { hooks } from "../../dep/hooks.js";
import app from "../../app.js";
import pipeline from "../pipeline.js";
import glob from "../../dep/glob.js";
var zoom;
(function (zoom) {
    let level = 3;
    const wheelEnabled = false;
    zoom.zooms = [1, 0.5, 0.33, 0.2, 0.1, 0.05];
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
        if (wheelEnabled && app.wheel == -1 || app.key('f') == 1) {
            console.log('app wheel');
            level = (level > 0) ? level - 1 : level;
            glob.rerenderGame = true;
        }
        if (wheelEnabled && app.wheel == 1 || app.key('r') == 1) {
            console.log('app wheel');
            level = (level < zoom.zooms.length - 1) ? level + 1 : level;
            glob.rerenderGame = true;
        }
        const scale = zoom.zooms[level];
        pipeline.camera.scale.set(scale, scale, scale);
        pipeline.camera.updateMatrix();
        return false;
    }
})(zoom || (zoom = {}));
export default zoom;
