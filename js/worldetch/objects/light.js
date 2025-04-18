import game_object from "./game object.js";
import tileform from "../tileform.js";
import sprite from "../sprite.js";
import worldetch__ from "../worldetch.js";
export class light extends game_object {
    light_source;
    constructor(data) {
        super({
            name: 'a light',
            ...data
        });
        this.data._type = 'light';
    }
    _create() {
        console.log(' create light ');
        this.light_source = new tileform.light_source({
            gobj: this,
            radiance: 200
        });
        this.light_source.create();
        // return;
        new sprite({
            gobj: this,
            spriteImage: 'hex/post.png',
            spriteSize: [worldetch__.hex_size[0], 30],
            bottomSort: true,
        });
        this.sprite?.create();
    }
    _delete() {
        super._delete();
        this.light_source?.delete(); // Crash without question mark
    }
    _step() {
        super._step();
        this.light_source.step();
    }
}
export default light;
