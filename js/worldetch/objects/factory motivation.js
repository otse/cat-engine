import tile from "./tile.js";
import wall from "./wall.js";
// Welcome to the chaos of worldetch! 🌍🔥
// Ex:
// Objects come in as data from the network
export function game_object_factory(data) {
    let gobj;
    switch (data._type) {
        case 'direct':
            console.warn(' unset type passed to factory ');
            break;
        case 'tile':
            gobj = new tile(data);
            break;
        case 'wall':
            gobj = new wall(data);
            break;
    }
    return gobj;
}
export default game_object_factory;
