import tile from "./tile.js";
// Reason number one: objects come in as data from the network
// Reason number two: it is friendlier to use type names than import a large number of class files
export function gobjfactory(data) {
    let obj;
    switch (data._type) {
        case 'tile':
            obj = new tile(data);
            break;
        case 'wall':
            //obj = new wall(data);
            break;
    }
    return obj;
}
export default gobjfactory;
