import tile from "./tile.js";
// Example second subclass of a gobj
export class bettertile extends tile {
    constructor(data) {
        super({
            name: 'a better tile',
            ...data
        });
        this.data._type = 'bettertile';
        console.log('bettertile', this.data);
    }
    fuck() {
    }
}
export default bettertile;
