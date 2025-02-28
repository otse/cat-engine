import area2 from "./area2.js"
import pts from "./pts.js"

enum TEST {
	Outside,
	Inside,
	Overlap
}

class aabb2 {
	static readonly TEST = TEST
	min: vec2
	max: vec2
	static dupe(aabb: aabb2) {
		return new aabb2(aabb.min, aabb.max)
	}
	constructor(a: vec2, b: vec2) {
		this.min = this.max = <vec2>[...a]
		if (b) {
			this.extend(b)
		}
	}
	to_area(): area2 {
		return new area2(this);
	}
	do(func: (pos: vec2) => void) {
		for (let y = this.min[1]; y < this.max[1]; y++) {
			for (let x = this.min[0]; x < this.max[0]; x++) {
				func([x, y]);
			}
		}
	}
	extend(v: vec2) {
		this.min = (pts.min(this.min, v))
		this.max = (pts.max(this.max, v))
	}
	diagonal(): vec2 {
		return (pts.subtract(this.max, this.min))
	}
	center(): vec2 {
		return (pts.add(this.min, pts.mult(this.diagonal(), 0.5)))
	}
	translate(v: vec2) {
		this.min = (pts.add(this.min, v))
		this.max = (pts.add(this.max, v))
	}
	test(b: aabb2) {
		if (this.max[0] < b.min[0] || this.min[0] > b.max[0] ||
			this.max[1] < b.min[1] || this.min[1] > b.max[1])
			return 0
		if (this.min[0] <= b.min[0] && this.max[0] >= b.max[0] &&
			this.min[1] <= b.min[1] && this.max[1] >= b.max[1])
			return 1
		return 2
	}
}

export default aabb2;