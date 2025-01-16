import { hooks } from "../../dep/hooks.js";
import app from "../../app.js";
import pts from "../../dep/pts.js";
import pipeline from "../pipeline.js";
import zoom from "./zoom.js";
var diver;
(function (diver) {
    function register() {
        hooks.addListener('romeComponents', step);
    }
    diver.register = register;
    const pos = [0, 0, 0];
    let begin = [0, 0];
    let before = [0, 0];
    let wpos = [0, 0];
    let rpos = [0, 0];
    function tick() {
        pan();
        set_camera();
    }
    function pan() {
        let continousMode = false;
        const continuousSpeed = -100;
        const panDivisor = -1;
        if (app.button(1) == 1) {
            let mouse = app.mouse();
            mouse[1] = -mouse[1];
            begin = mouse;
            before = pts.copy(rpos);
        }
        if (app.button(1) >= 1) {
            let mouse = app.mouse();
            mouse[1] = -mouse[1];
            let dif = pts.subtract(begin, mouse);
            if (continousMode) {
                dif = pts.divide(dif, continuousSpeed);
                rpos = pts.add(rpos, dif);
            }
            else {
                dif = pts.divide(dif, panDivisor);
                // necessary mods
                dif = pts.mult(dif, pipeline.dotsPerInch);
                dif = pts.mult(dif, zoom.get_actual_zoom());
                dif = pts.subtract(dif, before);
                rpos = pts.inv(dif);
            }
        }
        else if (app.button(1) == -1) {
            console.log('release');
            rpos = pts.floor(rpos);
        }
    }
    function set_camera() {
        const smooth = false;
        if (smooth) {
            rpos = pts.floor(rpos);
        }
        // let inv = pts.inv(this.rpos);
        // ren.groups.axisSwap.position.set(inv[0], inv[1], 0);
        pipeline.camera.position.set(rpos[0], rpos[1], 0);
    }
    async function step() {
        tick();
        pipeline.camera.updateProjectionMatrix();
        return false;
    }
})(diver || (diver = {}));
export default diver;
