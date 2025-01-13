import sprite from "../sprite.js";
import tile from "./tile.js";
// An exaxmple of what happens when you superclass a superclass
export class bettertile extends tile {
    constructor(data) {
        super({
            name: 'a better tile',
            ...data,
            // _type: 'bettertile' // Won't work
        });
        this.data._type = 'bettertile';
        new sprite({ bound: this, size: [12, 8] });
        console.log('bettertile', this.data);
    }
    fuck() {
    }
}
export default bettertile;
