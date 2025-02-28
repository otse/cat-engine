import aabb2 from "./aabb2.js";
import pts from "./pts.js"

/// Collection of points,
// so you can e.g. stagger it, do cutouts, etc

class area2 {
	static from_aabb(aabb: aabb2) {
		return aabb.to_area();
	}
	points: vec2[] = []
	constructor(readonly base: aabb2) {
		this._extract();
	}
	do(func: (pos: vec2) => void) {
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