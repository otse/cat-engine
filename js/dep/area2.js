import aabb2 from "./aabb2.js";
class area2 {
    base;
    static from_aabb(aabb) {
        return aabb2.area(aabb);
    }
    points = [];
    constructor(base) {
        this.base = base;
        this._extract();
    }
    do(func) {
        for (let i = 0; i < this.points.length; i++) {
            func(this.points[i]);
        }
    }
    _extract() {
        this.points = [];
        let x_ = 0;
        for (let y = this.base.min[1]; y < this.base.max[1]; y++) {
            for (let x = this.base.min[0]; x < this.base.max[0]; x++) {
                const isBorder = x === this.base.min[0] || x === this.base.max[0] - 1 || y === this.base.min[1] || y === this.base.max[1] - 1;
                const isUneven = x_++ % 2 === 1;
                this.points.push({ pos: [x, y], isBorder, isUneven });
            }
        }
    }
}
export default area2;
