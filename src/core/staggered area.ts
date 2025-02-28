/// Todo rename this to a function that takes a square area
// and then staggers it somehow

import aabb2 from "../dep/aabb2.js";
import area2 from "../dep/area2.js";


class staggered_area extends area2 {
	constructor(area: area2) {
		super(area.base);
		this._stagger();
	}
	_stagger() {
		this.points = [];
		for (let y = this.base.min[1]; y < this.base.max[1]; y++) {
			let x_ = 0;
			let shift = 0;
			for (let x = this.base.min[0]; x < this.base.max[0]; x++) {
				x_++;
				if (x_ % 2 === 0) {
					shift += 1;
				}
				this.points.push([x, y - shift]);
			}
		}
	}
}

export default staggered_area;