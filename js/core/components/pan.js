import hooks from "../../dep/hooks.js";
import app from "../../app.js";
import pts from "../../dep/pts.js";
import renderer from "../renderer.js";
import zoom from "./zoom.js";
import Loom from "../loom.js";
import tile from "../objects/tile.js";
import glob from "../../dep/glob.js";
import WorldManager from "../world manager.js";
import worldetch from "../../worldetch.js";
let wpos = [0, 0];
let rpos = [0, 0];
let begin = [0, 0];
let before = [0, 0];
// Todo haha
const panPerspectiveWarp = [1, 2];
export class pan {
    static panCompress = 2;
    static register() {
        hooks.addListener('worldetchComponents', this.step);
        this.startup();
    }
    static async step() {
        pan.do_the_math();
        return false;
    }
    static marker;
    static follower = undefined;
    // Make the marker move in full tiles?
    static noHalfMeasures = false;
    // Rpos be pixel-based?
    static roundRpos = true;
    // Punish the player after dragging the camera?
    static dragReleaseRoundsToNearestFullPixel = false;
    static get wpos() {
        return pts.copy(wpos);
    }
    static set wpos(w) {
        wpos = w;
        rpos = Loom.project(wpos);
    }
    static get rpos() {
        return pts.copy(rpos);
    }
    static set rpos(r) {
        rpos = r;
        wpos = Loom.unproject(rpos);
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
        wpos = (Loom.unproject(rpos));
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
            wpos = (pts.add(wpos, [.5, .5])); // ?
            rpos = (Loom.project(wpos));
        }
    }
    static arrows() {
        if (app.key('arrowright')) {
            rpos[0] += 1 * glob.scale;
            glob.dirtyobjects = true;
        }
        if (app.key('arrowleft')) {
            rpos[0] -= 1 * glob.scale;
            glob.dirtyobjects = true;
        }
        if (app.key('arrowup')) {
            rpos[1] += 1 * glob.scale;
            glob.dirtyobjects = true;
        }
        if (app.key('arrowdown')) {
            rpos[1] -= 1 * glob.scale;
            glob.dirtyobjects = true;
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
            glob.dirtyobjects = true;
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
                dif = (pts.mult(dif, glob.dotsPerInch));
                dif = (pts.mult(dif, zoom.scale()));
                dif = (pts.mult(dif, panPerspectiveWarp[0], panPerspectiveWarp[1]));
                if (renderer.USE_SCENE3)
                    dif = (pts.divide(dif, 2));
                dif = (pts.subtract(dif, before));
                rpos = (pts.inv(dif));
            }
        }
        else if (app.button(1) == -1) {
            console.log('release');
            if (this.dragReleaseRoundsToNearestFullPixel)
                rpos = (pts.round(rpos));
            this.dragging = false;
        }
    }
    static set_camera() {
        let rpos2 = pan.rpos; //(pts.add(rpos, pts.divide([0, glob.hexsize[1]], 2)));
        // The idea is to manage the increments of y of rpos2
        // Such that tiles are displayed
        // For isometric view, you just need to keep an even number 
        //if (pipeline.USE_SCENE3)
        // Critical evening
        // Uneven causes geometry errors below the equator
        rpos2 = pts.make_even(rpos2, 1);
        rpos2[1] = worldetch.roundToNearest(rpos2[1], glob.pancompress * 2);
        //const nearestPoint = this.unproject_chunk_grid(rpos2);
        //rpos2 = pts.round(rpos2);
        renderer.groups.camera.position.x = rpos2[0];
        renderer.groups.camera.position.y = rpos2[1];
        renderer.groups.camera.position.z = 10;
        renderer.groups.camera.updateMatrix();
        renderer.camera.rotation.x = glob.magiccamerarotation;
        renderer.camera.updateMatrix();
        renderer.camera.updateProjectionMatrix();
    }
    static unproject_chunk_grid(rpos) {
        // This function should pretend there is a grid
        // laid out over the arena (pipeline.scene)
        // at every render position in that arena, 
        let point = [0, 0];
        const chunks = Loom.helpers.getEveryChunk(WorldManager.world);
        for (const chunk of chunks) {
            // unproject all points within chunk.tfGrid and find the one
            // closest to our rpos
            // const tfGrid = chunk.tfGrid;
        }
        //geometry.attributes.position.array.forEach((pos, i) => {
        // });
    }
}
export default pan;
