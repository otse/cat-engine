/// This poorly named component turns basic models into tiles
//  for further use in pipeline.ts
import pipeline from "../pipeline.js";
var scaper;
(function (scaper) {
    async function init() {
        return boot();
    }
    scaper.init = init;
    async function boot() {
        const size = [24, 40];
        scaper.scene = new THREE.Scene();
        scaper.group = new THREE.Group();
        scaper.target = pipeline.make_render_target(size[0], size[1]);
        scaper.camera = pipeline.make_orthographic_camera(size[0], size[1]);
        scaper.scene.rotation.set(Math.PI / 6, Math.PI / 4, 0);
        scaper.group.rotation.set(-Math.PI / 2, 0, 0);
        scaper.ambient = new THREE.AmbientLight('#777');
        scaper.scene.add(scaper.ambient);
        const size2 = 100;
        scaper.sun = new THREE.DirectionalLight(0xffffff, 0.25);
        scaper.sun.position.set(-size2, 0, size2 / 2);
        scaper.renderer = new THREE.WebGLRenderer({
            antialias: false,
            // premultipliedAlpha: false
        });
    }
    function render() {
    }
    scaper.render = render;
})(scaper || (scaper = {}));
export default scaper;
