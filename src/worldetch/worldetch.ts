import glob from "../dep/glob.js";

const constantmagiccamerarotation = 0.962;

interface config_t {
    scale?: number
    hexsize?: number[]
    pancompress?: number
    camerarpos?: number[]
};

export class worldetch__ {
    // Increase by values of 0.0001
    static readonly three_to_one_camera_rotation = 0.962;

    static config: config_t

    static main: world

    static init(config: config_t) {
        this.config = config || {};

        glob.scale = 1;
        glob.camera_rotation = worldetch__.three_to_one_camera_rotation;
        glob.hex_size = [17, 15];
        glob.pan_compress = 2;
        glob.gobjs_tally = [0, 0];
    }
}

export default worldetch__;