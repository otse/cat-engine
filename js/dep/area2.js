/// Collection of points,
// so you can e.g. stagger it, do cutouts, etc
class area2 {
    base;
    static from_aabb(aabb) {
        return aabb.to_area();
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
        for (let y = this.base.min[1]; y < this.base.max[1]; y++) {
            for (let x = this.base.min[0]; x < this.base.max[0]; x++) {
                this.points.push([x, y]);
            }
        }
    }
}
export default area2;
