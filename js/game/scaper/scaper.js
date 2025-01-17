/// This poorly named component turns basic models into tiles
//  for further use in pipeline.ts
import pipeline from "../pipeline.js";
import sprite from "../sprite.js";
/*
bit of a rant
consider a game that uses an isometric 3d projection
*/
var scaper;
(function (scaper) {
    async function init() {
        const box = new THREE.BoxGeometry(50, 50, 50);
        const material = new THREE.MeshPhongMaterial({
            color: 'red',
            map: pipeline.load_texture('img/moorish-ornaments.jpg', 0)
        });
        const mesh = new THREE.Mesh(box, material);
        mesh.rotation.set(Math.PI / 6, Math.PI / 4, 0);
        mesh.position.set(0, 0, 0);
        pipeline.scene.add(mesh);
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
    function take(model) {
        pipeline.erase_children(scaper.group);
        // material.map = this.target.texture;
    }
    scaper.take = take;
    function render() {
        scaper.renderer.setRenderTarget(scaper.target);
        scaper.renderer.clear();
        scaper.renderer.render(scaper.scene, scaper.camera);
    }
    scaper.render = render;
    class model {
    }
    class modelsprite extends sprite {
        model;
        target;
        constructor(data, model) {
            super(data);
            this.model = model;
            this.basic();
        }
        basic() {
            this.target = pipeline.make_render_target(this.data.size[0], this.data.size[1]);
        }
        render() {
            scaper.take(this);
            scaper.render();
        }
    }
})(scaper || (scaper = {}));
export default scaper;
