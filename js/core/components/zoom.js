import hooks from "../../dep/hooks.js";
import app from "../../app.js";
import renderer from "../renderer.js";
import glob from "../../dep/glob.js";
var zoom;
(function (zoom) {
    zoom.level = 3;
    const wheelEnabled = false;
    zoom.zooms = [1, 0.5, 0.33, 0.2, 0.1, 0.05];
    function register() {
        hooks.addListener('worldetchComponents', step);
    }
    zoom.register = register;
    function scale() {
        return zoom.zooms[zoom.level];
    }
    zoom.scale = scale;
    async function step() {
        //console.log('zoom step');
        if (wheelEnabled && app.wheel == -1 || app.key('f') == 1) {
            console.log('app wheel');
            zoom.level = (zoom.level > 0) ? zoom.level - 1 : zoom.level;
            glob.dirtyobjects = true;
        }
        if (wheelEnabled && app.wheel == 1 || app.key('r') == 1) {
            console.log('app wheel');
            zoom.level = (zoom.level < zoom.zooms.length - 1) ? zoom.level + 1 : zoom.level;
            glob.dirtyobjects = true;
        }
        const camera = renderer.USE_SCENE3 ? renderer.camera3 : renderer.camera;
        const scale = zoom.zooms[zoom.level];
        if (renderer.cameraMode == 'perspective') {
            renderer.camera.position.z = (5 - zoom.level) * 40 || 10;
        }
        else {
            camera.scale.set(scale, scale, scale);
        }
        camera.updateMatrix();
        camera.updateProjectionMatrix();
        return false;
    }
})(zoom || (zoom = {}));
export default zoom;
