import hooks from "../../dep/hooks.js";
import app from "../../app.js";
import pts from "../../dep/pts.js";
import renderer from "../renderer.js";
import zoom from "./zoom.js";
import lod from "../lod.js";
import tile from "../objects/tile.js";
import glob from "../../dep/glob.js";
import worldetch__ from "../worldetch.js";
// Welcome to the chaos of worldetch! 🌍🔥
let wpos = [0, 0];
let rpos = [0, 0];
let begin = [0, 0];
let before = [0, 0];
// (Components can be excluded by not registering them. 🛠️)
// This component does a lot! It can likely do what you want it to do...
// Check the settings.
export class pan {
    static register() {
        hooks.addListener('worldetchComponents', this.step);
        this.startup();
    }
    static step() {
        pan.do_the_math();
        return false;
    }
    static marker;
    static follower = undefined;
    // Make the "center marker" move in full tiles?
    static noHalfMeasures = false;
    // Rpos be pixel-based?
    static roundRpos = true;
    // Punish the player after dragging the camera?
    static dragReleaseRoundsToNearestFullPixel = true;
    static get wpos() {
        return pts.copy(wpos);
    }
    static set wpos(w) {
        wpos = w;
        rpos = lod.project(wpos);
    }
    static get rpos() {
        return pts.copy(rpos);
    }
    static set rpos(r) {
        rpos = r;
        wpos = lod.unproject(rpos);
    }
    static startup() {
        this.wpos = [10, 1];
        this.marker = new tile({
            _wpos: [...wpos, 0],
            colorOverride: 'purple',
            lonely: true,
        });
        this.marker.show();
        window['panMarker'] = this.marker;
    }
    static do_the_math() {
        this.follow();
        this.pan();
        this.arrows();
        wpos = (lod.unproject(rpos));
        if (this.roundRpos)
            rpos = (pts.floor(rpos));
        this.marker.wpos = wpos;
        if (this.noHalfMeasures)
            this.marker.wpos = (pts.round(this.marker.wpos));
        this.marker._wtorpos();
        this.marker.update();
        this.set_camera();
        // Archaic code from wastes
        //lod.gworld.update(wpos);
    }
    static follow() {
        if (this.follower) {
            let wpos = this.follower.wpos;
            wpos = (pts.add(wpos, [.5, .5])); // What
            rpos = (lod.project(wpos));
        }
    }
    static arrows() {
        if (app.key('arrowright')) {
            rpos[0] += 1 * worldetch__.scale;
        }
        if (app.key('arrowleft')) {
            rpos[0] -= 1 * worldetch__.scale;
        }
        if (app.key('arrowup')) {
            rpos[1] += 1 * worldetch__.scale;
        }
        if (app.key('arrowdown')) {
            rpos[1] -= 1 * worldetch__.scale;
        }
    }
    static dragging = false;
    static pan() {
        const continuousMode = false;
        const continuousSpeed = -100;
        const panDirection = -1;
        if (app.button(1) == 1) {
            let mouse = app.mouse();
            mouse[1] = -mouse[1];
            begin = mouse;
            before = pts.copy(rpos);
            this.dragging = true;
        }
        if (this.dragging == false)
            return;
        if (app.button(1) >= 1) {
            let mouse = app.mouse();
            mouse[1] = -mouse[1];
            let dif = (pts.subtract(begin, mouse));
            if (continuousMode) {
                dif = (pts.divide(dif, continuousSpeed));
                rpos = (pts.add(rpos, dif));
            }
            else {
                dif = (pts.divide(dif, panDirection));
                // Scale
                dif = (pts.mult(dif, zoom.scale()));
                dif = (pts.mult(dif, renderer.dots_per_inch));
                dif = (pts.mult(dif, 1, worldetch__.pan_compress));
                if (renderer.USE_EXTRA_RENDER_TARGET)
                    dif = (pts.divide(dif, 2));
                dif = (pts.subtract(dif, before));
                rpos = (pts.inv(dif));
            }
        }
        else if (app.button(1) == -1) {
            console.log('release');
            this.dragging = false;
        }
    }
    static set_camera() {
        let rpos2 = pan.rpos;
        // Uneven can cause geometry errors below the equator
        // rpos2 = pts.make_even(rpos2, 1);
        let pan_compress = worldetch__.pan_compress;
        if (renderer.dithering)
            pan_compress *= 2;
        rpos2[1] = glob.round_to_nearest(rpos2[1], pan_compress);
        //const nearestPoint = this.unproject_chunk_grid(rpos2);
        //rpos2 = pts.round(rpos2);
        renderer.groups.camera.position.x = rpos2[0];
        renderer.groups.camera.position.y = rpos2[1];
        renderer.groups.camera.position.z = 10;
        renderer.groups.camera.updateMatrix();
        renderer.camera.rotation.x = worldetch__.camera_rotation;
        renderer.camera.updateMatrix();
        renderer.camera.updateProjectionMatrix();
    }
}
export default pan;
