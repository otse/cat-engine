import { hooks } from "../../dep/hooks.js";
import app from "../../app.js";
import pipeline from "../pipeline.js";
import glob from "../../dep/glob.js";


namespace zoom {
    export let level = 3;

    const wheelEnabled = false;

    export const zooms = [1, 0.5, 0.33, 0.2, 0.1, 0.05];

    export function register() {
        hooks.addListener('romeComponents', step);
    }

    export function scale() {
        return zooms[level];
    }

    async function step() {
        //console.log('zoom step');

        if (wheelEnabled && app.wheel == -1 || app.key('f') == 1) {
            console.log('app wheel');
            level = (level > 0) ? level - 1 : level;
            glob.dirtyObjects = true;
        }
        if (wheelEnabled && app.wheel == 1 || app.key('r') == 1) {
            console.log('app wheel');
            level = (level < zooms.length - 1) ? level + 1 : level;
            glob.dirtyObjects = true;
        }
        const camera = pipeline.ENABLE_SCENE3 ? pipeline.camera3 : pipeline.camera;
        const scale = zooms[level];
        if (pipeline.cameraMode == 'perspective') {
            pipeline.camera.position.z = (5 - level) * 40 || 10;
        }
        else {
            camera.scale.set(scale, scale, scale);
        }
        camera.updateMatrix();
        camera.updateProjectionMatrix();
        return false;
    }

}

export default zoom;