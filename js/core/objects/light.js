import game_object from "./game object.js";
// I think it's better to make a tileform.light entity
// Rather than overload a sprite3d to become anything you want it to
export class light extends game_object {
    // The tileform entity
    tfLight;
    constructor(data) {
        super({
            name: 'a light',
            ...data
        });
        this.data._type = 'light';
    }
    _create() {
        // Create a tileform.light here
    }
}
export default light;
