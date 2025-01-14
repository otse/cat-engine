
import gobj from "./gobj.js";
import tile from "./tile.js";

// Reason number one: objects come in as data from the network
// Reason number two: it is friendlier to use type names than import a large number of class files

export function gobjfactory(data: gobj_literal): gobj | undefined {
    let obj: gobj | undefined;
    switch (data._type) {
        case 'dud':
        case 'direct':
            console.warn(' unset type passed to factory ');
            break;
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