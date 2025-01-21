import { hooks } from "../../dep/hooks.js";
import app from "../../app.js";
import pts from "../../dep/pts.js";
import pipeline from "../pipeline.js";
import zoom from "./zoom.js";
import clod from "../clod.js";
var pan;
(function (pan_1) {
    function register() {
        hooks.addListener('romeComponents', step);
    }
    pan_1.register = register;
    async function step() {
        functions();
        pipeline.camera.updateProjectionMatrix();
        return false;
    }
    let begin = [0, 0];
    let before = [0, 0];
    let wpos = [0, 0];
    let rpos = [0, 0];
    let stick = undefined;
    const rposIsBasedOnWpos = false;
    function functions() {
        follow();
        pan();
        wpos = clod.unproject(rpos);
        set_camera();
        //lod.gworld.update(wpos);
    }
    function follow() {
        if (stick) {
            let wpos = stick.wpos;
            // Todo .5 ?
            wpos = pts.add(wpos, [.5, .5]);
            rpos = clod.project(wpos);
        }
        else {
            if (rposIsBasedOnWpos)
                rpos = clod.project(wpos);
        }
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
                dif = pts.mult(dif, zoom.actualZoom());
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
            rpos = pts.round(rpos);
        }
        // let inv = pts.inv(this.rpos);
        // ren.groups.axisSwap.position.set(inv[0], inv[1], 0);
        pipeline.camera.position.set(rpos[0], rpos[1], 0);
    }
})(pan || (pan = {}));
export default pan;
