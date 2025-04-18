import glob from "../../dep/glob.js";
import hooks from "../../dep/hooks.js";
import pts from "../../dep/pts.js";
import lod from "../lod.js";
import renderer from "../renderer.js";
import tileform from "../tileform.js";
import world from "../world.js";
import worldetch__ from "../worldetch.js";
import pan from "./pan.js";
import zoom from "./zoom.js";
// Welcome to the chaos of worldetch! 🌍🔥
// Components can be turned off by not registering them. 🛠️
export class debug_screen {
    static register() {
        hooks.addListener('worldetchComponents', this.step);
        this.startup();
    }
    static step() {
        step();
        return false;
    }
    static startup() {
    }
}
function step() {
    document.querySelector('worldetch-stats').innerHTML = `
		worldetch - monolith git branch (debug screen)
		<br />DOTS_PER_INCH_CORRECTED_RENDER_TARGET: ${renderer.DOTS_PER_INCH_CORRECTED_RENDER_TARGET}
		<br />ROUND_UP_DOTS_PER_INCH: ${renderer.ROUND_UP_DOTS_PER_INCH}
		<br />USE_SCENE3: ${renderer.USE_EXTRA_RENDER_TARGET}
		<br />DITHERING (d): ${renderer.dithering}
		<br />--
		<br />TOGGLE_TOP_DOWN_MODE (f1): ${tileform.TOGGLE_TOP_DOWN_MODE}
		<br />TOGGLE_RENDER_AXES (f2): ${tileform.TOGGLE_RENDER_AXES}
		<br />TOGGLE_NORMAL_MAPS (f3): ${tileform.TOGGLE_NORMAL_MAPS}
		<br />--
		<br />"globs"
		<br />&#9;randomspritecolor (h): ${glob.randomspritecolor}
		<br />wallrotation (v, b): ${glob.wallrotation}
		<br />pan compress (v, b): ${worldetch__.pan_compress}
		<br />camera rotation x (v, b): ${worldetch__.camera_rotation}
		<br />--
		<br />color correction (z): ${renderer.compression}
		<br />render scale (-, =): ${worldetch__.scale}
		<br />zoom scale (r, f): ${zoom.scale()}
		<br />grid (t, g): ${world.default_world.world.grid.spread} / ${world.default_world.world.grid.outside}
		<br />hexscalar ([, ]): ${tileform.hexscalar}
		<br />--
		<br />fps: ${glob.fps?.toFixed(2)} ${glob.delta?.toFixed(3)}
		<br />hex size (q, a): ${pts.to_string_fixed(worldetch__.hex_size)}
		<!--<br />cameraMode: ${renderer.cameraMode}-->
		<br />chunk span size: ${lod.chunk_span} x ${lod.chunk_span}
		<br />gobjs: ${glob.gobjs_tally[0]} / ${glob.gobjs_tally[1]}
		<br />chunks: ${lod.numbers.chunks[0]} / ${lod.numbers.chunks[1]}
		<br />pan wpos, rpos: ${pts.to_string_fixed(pan.wpos)} (${pts.to_string_fixed(pan.rpos)})
		`;
}
export default debug_screen;
