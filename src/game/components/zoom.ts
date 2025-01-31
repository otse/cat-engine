import { hooks } from "../../dep/hooks.js";
import app from "../../app.js";
import pipeline from "../pipeline.js";


namespace zoom {
    let level = 0;
    export const zooms = [1, 0.5, 0.33, 0.2, 0.1, 0.05];

    export function register() {
        hooks.addListener('romeComponents', step);
    }

    export function actualZoom() {
        return zooms[level];
    }

    async function step() {
        //console.log('zoom step');
        
        if (app.wheel == -1 || app.key('f') == 1) {
            console.log('app wheel');
            level = (level > 0) ? level - 1 : level;
        }
        if (app.wheel == 1 || app.key('r') == 1) {
            console.log('app wheel');
            level = (level < zooms.length - 1) ? level + 1 : level;
        }
        const scale = zooms[level];
        pipeline.camera.scale.set(scale, scale, scale);
        return false;
    }

}

export default zoom;