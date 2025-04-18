import hooks from "../../dep/hooks.js";
import app from "../../app.js";
import renderer from "../renderer.js";
import glob from "../../dep/glob.js";

// Welcome to the chaos of worldetch! 🌍🔥

// Components can be turned off by not registering them. 🛠️

class zoom {
    static level = 3
    static wheelEnabled = true
    static readonly zooms = [1, 0.5, 0.33, 0.2, 0.1, 0.05]

    static register() {
        hooks.addListener('worldetchComponents', this.step);
    }

    static scale() {
        return this.zooms[this.level];
    }

    static step() {
       zoom.zoom();
       return false;
    }

    static zoom() {
         if (this.wheelEnabled && app.wheel == -1 || app.key('f') == 1) {
            console.log('app wheel');
            this.level = (this.level > 0) ? this.level - 1 : this.level;
        }
        if (this.wheelEnabled && app.wheel == 1 || app.key('r') == 1) {
            console.log('app wheel');
            this.level = (this.level < this.zooms.length - 1) ? this.level + 1 : this.level;
        }
        const camera = renderer.USE_EXTRA_RENDER_TARGET ? renderer.camera3 : renderer.camera;
        const scale = this.zooms[this.level];
        if (renderer.cameraMode == 'perspective') {
            renderer.camera.position.z = (5 - this.level) * 40 || 10;
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