import { hooks } from "../../dep/hooks.js";
import app from "../../app.js";
import pts from "../../dep/pts.js";
import pipeline from "../pipeline.js";
import zoom from "./zoom.js";
import clod from "../clod.js";
import tile from "../objects/tile.js";
var pan;
(function (pan_1) {
    function register() {
        hooks.addListener('romeComponents', step);
        startup();
    }
    pan_1.register = register;
    async function step() {
        functions();
        pipeline.camera.updateProjectionMatrix();
        return false;
    }
    let begin = [0, 0];
    let before = [0, 0];
    pan_1.wpos = [0, 0];
    pan_1.rpos = [0, 0];
    let stick = undefined;
    const rposIsBasedOnWpos = false;
    var marker;
    function startup() {
        marker = new tile({
            _wpos: [0, 0, 0],
            colorOverride: 'purple',
            lonely: true,
        });
        marker.create();
    }
    function functions() {
        follow();
        pan();
        pan_1.wpos = clod.unproject(pan_1.rpos);
        marker.wpos = pan_1.wpos;
        marker.wtorpos();
        marker.update();
        //marker.
        console.log('wpos', pan_1.wpos);
        set_camera();
        //lod.gworld.update(wpos);
    }
    function follow() {
        if (stick) {
            let wpos = stick.wpos;
            // Todo .5 ?
            wpos = pts.add(wpos, [.5, .5]);
            pan_1.rpos = clod.project(wpos);
        }
        else {
            if (rposIsBasedOnWpos)
                pan_1.rpos = clod.project(pan_1.wpos);
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
            before = pts.copy(pan_1.rpos);
        }
        if (app.button(1) >= 1) {
            let mouse = app.mouse();
            mouse[1] = -mouse[1];
            let dif = pts.subtract(begin, mouse);
            if (continousMode) {
                dif = pts.divide(dif, continuousSpeed);
                pan_1.rpos = pts.add(pan_1.rpos, dif);
            }
            else {
                dif = pts.divide(dif, panDivisor);
                // necessary mods
                dif = pts.mult(dif, pipeline.dotsPerInch);
                dif = pts.mult(dif, zoom.actualZoom());
                dif = pts.subtract(dif, before);
                pan_1.rpos = pts.inv(dif);
            }
        }
        else if (app.button(1) == -1) {
            console.log('release');
            pan_1.rpos = pts.floor(pan_1.rpos);
        }
    }
    function set_camera() {
        const smooth = false;
        if (smooth) {
            pan_1.rpos = pts.round(pan_1.rpos);
        }
        // let inv = pts.inv(this.rpos);
        // ren.groups.axisSwap.position.set(inv[0], inv[1], 0);
        pipeline.camera.position.set(pan_1.rpos[0], pan_1.rpos[1], 0);
    }
})(pan || (pan = {}));
export default pan;
