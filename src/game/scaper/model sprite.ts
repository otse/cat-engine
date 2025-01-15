import pipeline from "../pipeline.js";
import sprite from "../sprite.js";
import scaper from "./scaper.js";

class modelsprite extends sprite {
    
    constructor(data: sprite.params) {
        super(data);
        // make a sprite
        // then set the material map to target texture
		// shape.material.map = this.target.texture;

    }
    render() {
        scaper.render();
    }
}