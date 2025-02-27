/// Todo rename this to a function that takes a square area
// and then staggers it somehow
import area2 from "../dep/area2.js";
/// You can do a c++ style cast on aabb.get_area(0)
// since it shares fields.
class staggered_area extends area2 {
    constructor(base) {
        super(base);
        this._stagger();
    }
    _stagger() {
    }
}
export default staggered_area;
