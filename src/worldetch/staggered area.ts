/// Made for Used By hex walls

import area2 from "../dep/area2.js";

// Welcome to the chaos of worldetch! 🌍🔥

interface point extends area2.areaPoint {
	isXUneven
	isYUneven
	isStaggered
}

namespace staggered_area {
	export type typee = point
}

class staggered_area extends area2 {
	points: point[] = []
	constructor(area: area2) {
		super(area.base); // Calls unnecessary extract
		this._stagger();
	}
	// do(func: (pos: point) => void) 
	_stagger() {
		this.points = [];
		let i = 0;
		let y_ = 0;
		for (let y = this.base.min[1]; y < this.base.max[1]; y++) {
			let x_ = 0;
			let shift = 0;
			const isYUneven = y_++ % 2 === 1;
			for (let x = this.base.min[0]; x < this.base.max[0]; x++) {
				const isXUneven = x_++ % 2 === 1;
				const isBorder = x === this.base.min[0] || x === this.base.max[0] - 1 || y === this.base.min[1] || y === this.base.max[1] - 1;
				const isStaggered = isXUneven;
				const isSouth = y === this.base.min[1];
				const isWest = x === this.base.max[0] - 1;
				const isNorth = y === this.base.max[1] - 1;
				const isEast = x === this.base.min[0];
				if (isXUneven) {
					shift += 1;
				}
				this.points.push({ pos: [x, y - shift], isBorder, isStaggered, isXUneven, isYUneven, isNorth, isEast, isSouth, isWest });
			}
		}
	}
	_tell_size() {
		
	}
}

export default staggered_area;