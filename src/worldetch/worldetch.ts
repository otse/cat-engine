import glob from "../dep/glob.js";

// Welcome to the chaos of worldetch! 🌍🔥

interface config_t {
    scale?: number
    hexsize?: number[]
    pancompress?: number
    camerarpos?: number[]
};

// 🚀 Welcome to engine config!
// 
// Fine-tune with an object literal

export class worldetch__ {
    static readonly three_to_one_camera_rotation = 0.962;

    static scale: number;
    static dots_per_inch: number;
    static camera_rotation: number;
    static pan_compress: number;
    static hex_size: vec2;
    static gobjs_tally: vec2;

    static config: config_t

    static main: world

    static init(config: config_t) {
        this.config = config || {};

        worldetch__.scale = 1;
        worldetch__.dots_per_inch = 1;
        worldetch__.camera_rotation = worldetch__.three_to_one_camera_rotation;
        worldetch__.pan_compress = 2;
        worldetch__.hex_size = [17, 15];
        worldetch__.gobjs_tally = [0, 0];
    }
}

export default worldetch__;