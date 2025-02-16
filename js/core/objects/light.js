import glob from "../../dep/glob.js";
import game_object from "./game object.js";
import tileform from "../tileform.js";
import sprite from "../sprite.js";
// I think it's better to make a tileform.light entity
// Rather than overload a sprite3d to become anything you want it to
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
        // Create a tileform.light here
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
            spriteSize: [glob.hexSize[0], 30],
            bottomSort: true,
        });
        this.sprite?.create();
    }
    _delete() {
        // Crash w/o qm wdym
        this.light_source?.delete();
        super._delete();
    }
    _step() {
        this.light_source.update();
    }
}
export default light;
