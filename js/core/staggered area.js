/// Todo rename this to a function that takes a square area
// and then staggers it somehow
import area2 from "../dep/area2.js";
class staggered_area extends area2 {
    data = [];
    constructor(area) {
        super(area.base); // calls unnecessary extract
        this._stagger();
    }
    // do(func: (pos: point) => void) 
    _stagger() {
        this.data = [];
        this.points = [];
        let i = 0;
        for (let y = this.base.min[1]; y < this.base.max[1]; y++) {
            let x_ = 0;
            let shift = 0;
            for (let x = this.base.min[0]; x < this.base.max[0]; x++) {
                x_++;
                if (x_ % 2 === 0) {
                    shift += 1;
                }
                const isBorder = x === this.base.min[0] || x === this.base.max[0] - 1 || y === this.base.min[1] || y === this.base.max[1] - 1;
                this.points.push({ pos: [x, y - shift], isBorder });
            }
        }
    }
}
export default staggered_area;
