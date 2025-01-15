import tile from "./tile.js";
import wall from "./wall.js";
// Reason number one: objects come in as data from the network
// Reason number two: it is friendlier to use type names than import a large number of class files
export function gobjfactory(data) {
    let gobj;
    switch (data._type) {
        case 'dud':
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
export default gobjfactory;
