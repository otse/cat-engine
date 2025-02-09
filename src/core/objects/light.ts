import glob from "../../dep/glob.js";

import game_object from "./game object.js";
import sprite3d from "../sprite 3d.js";

// I think it's better to make a tileform.light entity
// Rather than overload a sprite3d to become anything you want it to

export class light extends game_object {
    // The tileform entity
    tfLight
    constructor(data: game_object_literal) {
        super({
            name: 'a light',
            ...data
        });
        this.data._type = 'light';
    }
    protected override _create() {
        // Create a tileform.light here
        
    }
}

export default light;