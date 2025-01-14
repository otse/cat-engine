import app from "../../app.js";
import { hooks } from "../../dep/hooks.js";
import pipeline from "../pipeline.js";


namespace zoom {
    let zoom = 0;
    
    export function register() {
        hooks.addListener('romeStep', step);
    }

    async function step() {
        const zooms = [1, 0.5, 0.33, 0.2, 0.1, 0.05]
        if (app.wheel == -1) {
            zoom = (zoom > 0) ? zoom - 1 : zoom;
        }
        if (app.wheel == 1) {
            zoom = (zoom < 4) ? zoom + 1 : zoom;
        }
        const scale = zooms[zoom];
        pipeline.camera.scale.set(scale, scale, scale);
        pipeline.camera.updateProjectionMatrix();
        return false;
    }

}

export default zoom;