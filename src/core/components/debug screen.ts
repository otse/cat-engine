import glob from "../../dep/glob.js";
import hooks from "../../dep/hooks.js";
import pts from "../../dep/pts.js";
import Loom from "../loom.js";
import renderer from "../renderer.js";
import tileform from "../tileform.js";
import WorldManager from "../world manager.js";
import pan from "./pan.js";
import zoom from "./zoom.js";

export class debug_screen {

	static register() {
		hooks.addListener('worldetchComponents', this.step);
		this.startup();
	}

	static async step() {
		step();
		return false;
	}

	static startup() {

	}
}

function step() {
	
	document.querySelector('worldetch-stats')!.innerHTML = `
		worldetch - monolith git branch (debug screen)
		<br />DOTS_PER_INCH_CORRECTED_RENDER_TARGET: ${renderer.DOTS_PER_INCH_CORRECTED_RENDER_TARGET}
		<br />ROUND_UP_DOTS_PER_INCH: ${renderer.ROUND_UP_DOTS_PER_INCH}
		<br />USE_SCENE3: ${renderer.USE_SCENE3}
		<br />DITHERING (d): ${renderer.dithering}
		<br />--
		<br />TOGGLE_TOP_DOWN_MODE (f1): ${tileform.TOGGLE_TOP_DOWN_MODE}
		<br />TOGGLE_RENDER_AXES (f2): ${tileform.TOGGLE_RENDER_AXES}
		<br />TOGGLE_NORMAL_MAPS (f3): ${tileform.TOGGLE_NORMAL_MAPS}
		<br />--
		<br />"globs"
		<br />&#9;randomspritecolor (h): ${glob.randomspritecolor}
		<br />magiccamerarotation (v, b): ${glob.magiccamerarotation}
		<br />wallrotation (v, b): ${glob.wallrotation}
		<br />pancompress (v, b): ${glob.pancompress}
		<br />--
		<br />camera rotation x (v, b): ${glob.magiccamerarotation}
		<br />color correction (z): ${renderer.compression}
		<br />render scale (-, =): ${glob.scale}
		<br />zoom scale (r, f): ${zoom.scale()}
		<br />grid (t, g): ${WorldManager.world.grid.spread} / ${WorldManager.world.grid.outside}
		<br />hexscalar ([, ]): ${tileform.hexscalar}
		<br />--
		<br />fps: ${glob.fps?.toFixed(2)} ${glob.delta?.toFixed(3)}
		<br />reprerender: ${glob.reprerender}
		<br />dirtyObjects: ${glob.dirtyobjects}
		<br />hex size (q, a): ${pts.to_string_fixed(glob.hexsize)}
		<!--<br />cameraMode: ${renderer.cameraMode}-->
		<br />chunk span size: ${Loom.chunk_span} x ${Loom.chunk_span}
		<br />gobjs: ${glob.gobjscount[0]} / ${glob.gobjscount[1]}
		<br />chunks: ${Loom.numbers.chunks[0]} / ${Loom.numbers.chunks[1]}
		<br />pan wpos, rpos: ${pts.to_string_fixed(pan.wpos)} (${pts.to_string_fixed(pan.rpos)})
		`;
}

export default debug_screen;
