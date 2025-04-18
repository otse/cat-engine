import glob from "../dep/glob.js";
const constantmagiccamerarotation = 0.962;
;
export class worldetch__ {
    // Increase by values of 0.0001
    static three_to_one_camera_rotation = 0.962;
    static config;
    static main;
    static init(config) {
        this.config = config || {};
        glob.scale = 1;
        glob.camera_rotation = worldetch__.three_to_one_camera_rotation;
        glob.hex_size = [17, 15];
        glob.pan_compress = 2;
        glob.gobjs_tally = [0, 0];
    }
}
export default worldetch__;
