/// This poorly named component turns basic 3d shapes into sprites
import glob from "../dep/glob.js";
import pipeline from "./pipeline.js";
var tileform;
(function (tileform) {
    async function init() {
        await stage.init();
        return;
    }
    tileform.init = init;
    let stage;
    (function (stage) {
    })(stage = tileform.stage || (tileform.stage = {}));
    (function (stage) {
        async function init() {
            await preload();
            await boot();
        }
        stage.init = init;
        async function preload() {
            await pipeline.loadTextureAsync('./img/textures/stonemixed.jpg');
        }
        async function boot() {
            stage.scene = new THREE.Scene();
            // scene.background = new THREE.Color('purple');
            stage.scene.rotation.set(Math.PI / 6, Math.PI / Math.PI, 0);
            stage.camera = new THREE.OrthographicCamera(100 / -2, 100 / 2, 100 / 2, 100 / -2, -100, 100);
            stage.group = new THREE.Group();
            stage.group.rotation.set(-Math.PI / 2, 0, 0);
            stage.group.updateMatrix();
            stage.scene.add(stage.group);
            stage.scene.updateMatrix();
            stage.ambient = new THREE.AmbientLight('white', 1);
            stage.scene.add(stage.ambient);
            const sunDistance = 100;
            stage.sun = new THREE.DirectionalLight('yellow', 1);
            stage.sun.position.set(-sunDistance, 0, sunDistance / 2);
            stage.scene.add(stage.sun);
            /*renderer = new THREE.WebGLRenderer({
                antialias: false,
            });
            renderer.setPixelRatio(glob);
            renderer.setSize(100, 100);
            renderer.setClearColor(0xffffff, 1);
            renderer.autoClear = true;
            renderer.toneMapping = THREE.NoToneMapping;*/
            // document.body.appendChild(renderer.domElement);
        }
        function prepare(sprite) {
            stage.spotlight = sprite;
            const size = sprite.data.size;
            stage.camera = new THREE.OrthographicCamera(size[0] / -2, size[0] / 2, size[1] / 2, size[1] / -2, -100, 100);
            while (stage.group.children.length > 0)
                stage.group.remove(stage.group.children[0]);
            stage.group.add(sprite.shape.mesh);
        }
        stage.prepare = prepare;
        function render() {
            // Todo: stage renderer doesn't render anything so use default
            glob.renderer.setRenderTarget(stage.spotlight.target);
            glob.renderer.clear();
            glob.renderer.render(stage.scene, stage.camera);
            glob.renderer.setRenderTarget(null);
        }
        stage.render = render;
    })(stage = tileform.stage || (tileform.stage = {}));
    // end of stage
    // shapes
    class shape_base {
        data;
        mesh;
        constructor(data) {
            this.data = data;
            this._create();
        }
        _create() { }
    }
    tileform.shape_base = shape_base;
    class shape_box extends shape_base {
        constructor(data) {
            super(data);
            this._create();
        }
        _create() {
            const box = new THREE.BoxGeometry(8, 20, 10);
            const material = new THREE.MeshPhongMaterial({
                // color: 'red',
                map: pipeline.loadTexture(this.data.texture, 0)
            });
            const mesh = new THREE.Mesh(box, material);
            this.mesh = mesh;
        }
    }
    tileform.shape_box = shape_box;
    function shapeMaker(type, data) {
        let shape;
        switch (type) {
            case 'nothing':
                console.warn(' no type passed to factory ');
                break;
            case 'wall':
                shape = new shape_box(data);
                break;
        }
        return shape;
    }
    tileform.shapeMaker = shapeMaker;
})(tileform || (tileform = {}));
export default tileform;
