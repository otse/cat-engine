import aabb2 from "./aabb2.js";

/// When you want to iterate an aabb2 you come here

interface point {
	pos: vec2,
	isBorder
	isNorth, isEast, isSouth, isWest
}

namespace area2 {
	export type areaPoint = point
}

class area2 {
	static from_aabb(aabb: aabb2) {
		return aabb2.area(aabb);
	}
	points: point[] = []
	constructor(readonly base: aabb2) {
		this._extract();
	}
	do(func: (pos: point) => void) {
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
				const isNorth = y === this.base.min[1];
				const isEast = x === this.base.max[0] - 1;
				const isSouth = y === this.base.max[1] - 1;
				const isWest = x === this.base.min[0];
				this.points.push({ pos: [x, y], isBorder, isNorth, isEast, isSouth, isWest });
			}
		}
	}
}

export default area2;