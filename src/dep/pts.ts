import aabb2 from "./aabb2.js";
import glob from "./glob.js";

export interface Pt { x: number; y: number };

type both = vec2 | vec3;

// glob.hex_size = [10, 10];

class pts {
	static pt(a: vec2): Pt {
		return { x: a[0], y: a[1] };
	}

	static vec2s(a: vec2): vec2s {
		return [String(a[0]), String(a[1])];
	}

	static area_every(aabb: aabb2, callback: (pos: vec2) => any) {
		let y = aabb.min[1];
		for (; y <= aabb.max[1]; y++) {
			let x = aabb.max[0];
			for (; x >= aabb.min[0]; x--) {
				callback([x, y]);
			}
		}
	}

	static copy(a: both): vec2 {
		return [a[0], a[1]];
	}

	static make(n: number, m: number): vec2 {
		return [n, m];
	}

	static to_string(a: vec2 | vec3 | vec4) {
		const pr = (b) => b != undefined ? `, ${b}` : '';

		return `${a[0]}, ${a[1]}` + pr(a[2]) + pr(a[3]);
	}

	static to_string_fixed(a: vec2 | vec3 | vec4) {
		const pr = (b) => b != undefined ? `, ${b}` : '';

		return `${a[0].toFixed(1)}, ${a[1].toFixed(1)}` + pr(a[2]) + pr(a[3]);
	}

	static func(bb: aabb2, callback: (pos: vec2) => any) {
		let y = bb.min[1];
		for (; y <= bb.max[1]; y++) {
			let x = bb.max[0];
			for (; x >= bb.min[0]; x--) {
				callback([x, y]);
			}
		}
	}

	// static readonly hexSize: vec2 = [17, 9];

	static project(w: vec2, hex_size: vec2): vec2 {
		const tileWidth = hex_size[0] - 1;
		const tileHeight = hex_size[1] - 1;
		const x = w[0];
		const y = -w[1]; // Invert Y to match the hex grid behavior.
		const scaleFactor = tileWidth * 0.75;  // This corresponds to the scaling factor in project function
		return [
			(x - y) * ((scaleFactor)),
			(x + y) * ((-tileHeight) / 2)
		];
	}

	static unproject(r: vec2, hex_size: vec2): vec2 {
		const tileWidth = hex_size[0] - 1;
		const tileHeight = hex_size[1] - 1;

		// Reverse the Y-axis scaling, considering tileHeight
		const scaleFactor = tileWidth * 0.75;  // This corresponds to the scaling factor in project function

		// Convert screen coordinates back to world coordinates
		const x = r[0] / scaleFactor;
		const y = -r[1] / (tileHeight / 2);

		// Use the formula to convert to grid coordinates
		const worldX = (x + y) / 2;
		const worldY = (x - y) / 2;

		return [worldX, worldY];
	}


	static equals(a: vec2, b: vec2): boolean {
		return a[0] == b[0] && a[1] == b[1];
	}

	//static range(a: vec2, b: vec2): boolean {
	//	return true 
	//}
	/*
	static clamp(a: vec2, min: vec2, max: vec2): vec2 {
		const clamp = (val, min, max) =>
			val > max ? max : val < min ? min : val;
		return [clamp(a[0], min[0], max[0]), clamp(a[1], min[1], max[1])];
	}
	*/

	static floor(a: vec2): vec2 {
		return [Math.floor(a[0]), Math.floor(a[1])];
	}

	static ceil(a: vec2): vec2 {
		return [Math.ceil(a[0]), Math.ceil(a[1])];
	}

	static round(a: vec2): vec2 {
		return [Math.round(a[0]), Math.round(a[1])];
	}

	static inv(a: vec2): vec2 {
		return [-a[0], -a[1]];
	}

	static mult(a: vec2, n: number, m?: number): vec2 {
		return [a[0] * n, a[1] * (m || n)];
	}

	static mults(a: vec2, b: vec2): vec2 {
		return [a[0] * b[0], a[1] * b[1]];
	}

	static divide(a: both, n: number, m?: number): vec2 {
		return [a[0] / n, a[1] / (m || n)];
	}

	static divides(a: vec2, b: vec2): vec2 {
		return [a[0] / b[0], a[1] / b[1]];
	}

	static subtract(a: vec2, b: vec2): vec2 {
		return [a[0] - b[0], a[1] - b[1]];
	}

	static add(a: vec2, b: vec2): vec2 {
		return [a[0] + b[0], a[1] + b[1]];
	}

	static addn(a: vec2, b: number): vec2 {
		return [a[0] + b, a[1] + b];
	}

	static abs(a: vec2): vec2 {
		return [Math.abs(a[0]), Math.abs(a[1])];
	}

	static min(a: both, b: both): vec2 {
		return [Math.min(a[0], b[0]), Math.min(a[1], b[1])];
	}

	static max(a: both, b: both): vec2 {
		return [Math.max(a[0], b[0]), Math.max(a[1], b[1])];
	}

	static _32(a: vec3): vec2 {
		return [a[0], a[1]];
	}

	static together(zx: vec2): number {
		return zx[0] + zx[1];
	}

	static make_uneven(a: vec2, n: number = -1): vec2 {
		let b = pts.copy(a);
		if (b[0] % 2 != 1) {
			b[0] += n;
		}
		if (b[1] % 2 != 1) {
			b[1] += n;
		}
		return b;
	}
	static make_even(a: vec2, n: number = -1): vec2 {
		let b = pts.copy(a);
		if (b[0] % 2 != 0) {
			b[0] += n;
		}
		if (b[1] % 2 != 0) {
			b[1] += n;
		}
		return b;
	}

	static angle(a: vec2, b: vec2) {
		return -Math.atan2(
			a[0] - b[0],
			a[1] - b[1])
	}

	// https://vorg.github.io/pex/docs/pex-geom/Vec2.html

	static dist(a: vec2, b: vec2): number {
		let dx = b[0] - a[0];
		let dy = b[1] - a[1];
		return Math.sqrt(dx * dx + dy * dy);
	}

	static distsimple(a: vec2, b: vec2) {
		let c = pts.abs(pts.subtract(a, b));
		return Math.max(c[0], c[1]);
	};

}

export default pts;