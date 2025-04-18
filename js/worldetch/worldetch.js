;
// 🚀 Welcome to engine config! Fine-tune here.
export class worldetch__ {
    static three_to_one_camera_rotation = 0.962;
    static dots_per_inch;
    static scale;
    static hex_size;
    static gobjs_tally;
    static camera_rotation;
    static pan_compress;
    static config;
    static main;
    static init(config) {
        this.config = config || {};
        worldetch__.dots_per_inch = 1;
        worldetch__.scale = 1;
        worldetch__.hex_size = [17, 15];
        worldetch__.gobjs_tally = [0, 0];
        worldetch__.camera_rotation = worldetch__.three_to_one_camera_rotation;
        worldetch__.pan_compress = 2;
    }
}
export default worldetch__;
