/// This poorly named component turns basic models into tiles
import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
var tileform;
(function (tileform) {
    async function init() {
        const box = new THREE.BoxGeometry(20, 20, 20);
        const material = new THREE.MeshPhongMaterial({
            color: 'red',
            map: pipeline.loadTexture('img/moorish-ornaments.jpg', 0)
        });
        const mesh = new THREE.Mesh(box, material);
        mesh.rotation.set(Math.PI / 6, Math.PI / 4, 0);
        mesh.position.set(0, 0, 0);
        pipeline.scene.add(mesh);
        await stage.init();
        return;
    }
    tileform.init = init;
    let stage;
    (function (stage) {
    })(stage = tileform.stage || (tileform.stage = {}));
    (function (stage) {
        async function init() {
            boot();
            makeBasicShapes();
        }
        stage.init = init;
        async function boot() {
            const size = [24, 40];
            stage.scene = new THREE.Scene();
            stage.group = new THREE.Group();
            stage.target = pipeline.makeRenderTarget(size[0], size[1]);
            stage.camera = pipeline.makeOrthographicCamera(size[0], size[1]);
            stage.scene.rotation.set(Math.PI / 6, Math.PI / 4, 0);
            stage.group.rotation.set(-Math.PI / 2, 0, 0);
            stage.ambient = new THREE.AmbientLight('#777');
            stage.scene.add(stage.ambient);
            const sunDistance = 100;
            stage.sun = new THREE.DirectionalLight(0xffffff, 0.25);
            stage.sun.position.set(-sunDistance, 0, sunDistance / 2);
            stage.renderer = new THREE.WebGLRenderer({
                antialias: false,
            });
        }
        let boxx;
        let boz;
        async function makeBasicShapes() {
            const box = new THREE.BoxGeometry(10, 10, 10);
            const material = new THREE.MeshPhongMaterial({
                color: 'red',
                map: pipeline.loadTexture('img/moorish-ornaments.jpg', 0)
            });
            const mesh = new THREE.Mesh(box, material);
            mesh.rotation.set(Math.PI / 6, Math.PI / 4, 0);
            mesh.position.set(0, 0, 0);
            boxx = mesh;
            const boz = new shapeormodel();
            boz.object = boxx;
        }
        function prepare(sprite) {
            stage.group.add(sprite.shape.object);
            pipeline.utilEraseChildren(stage.group);
            // material.map = this.target.texture;
        }
        stage.prepare = prepare;
        function render() {
            stage.renderer.setRenderTarget(stage.target);
            stage.renderer.clear();
            stage.renderer.render(stage.scene, stage.camera);
        }
        stage.render = render;
    })(stage = tileform.stage || (tileform.stage = {}));
    class shapeormodel {
        object;
        constructor() {
        }
    }
    function resolveShape(shape) {
        return shapeormodel;
    }
    class spriteshape extends sprite {
        target;
        shape;
        constructor(shape, data) {
            super(data);
            this.shape = resolveShape(shape);
            this.basic();
        }
        basic() {
            this.target = pipeline.makeRenderTarget(this.data.size[0], this.data.size[1]);
        }
        render() {
            tileform.stage.prepare(this);
            tileform.stage.render();
        }
    }
    tileform.spriteshape = spriteshape;
})(tileform || (tileform = {}));
export default tileform;
