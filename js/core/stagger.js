/// Todo rename this to a function that takes a square area
// and then staggers it somehow
import aabb2 from "../dep/aabb2.js";
class stagger {
    area;
    constructor(area) {
        this.area = area;
    }
    // Staggering
    stagger_outline() {
        const dupe = aabb2.dupe(this.area);
        for (let y = this.area.min[1]; y < this.area.max[1]; y++) {
            for (let x = this.area.min[0]; x < this.area.max[0]; x++) {
            }
        }
    }
    get_stagger(pos) {
    }
    static take(area) {
        this.do(area);
    }
    static do(area) {
        const staggeredArea = aabb2.dupe(area);
        for (let y = area.min[1]; y < area.max[1]; y++) {
            for (let x = area.min[0]; x < area.max[0]; y++) {
            }
        }
    }
}
export default stagger;
