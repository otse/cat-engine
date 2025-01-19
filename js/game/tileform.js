/// This poorly named component turns basic models into tiles
import glob from "../dep/glob.js";
import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
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
            await boot();
        }
        stage.init = init;
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
            stage.renderer = new THREE.WebGLRenderer({
                antialias: false,
            });
            stage.renderer.setPixelRatio(glob);
            stage.renderer.setSize(100, 100);
            stage.renderer.setClearColor(0xffffff, 1);
            stage.renderer.autoClear = true;
            stage.renderer.toneMapping = THREE.NoToneMapping;
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
            // Todo: Using our own stage renderer gives us a black result
            glob.renderer.setRenderTarget(stage.spotlight.target);
            glob.renderer.clear();
            glob.renderer.render(stage.scene, stage.camera);
            glob.renderer.setRenderTarget(null);
        }
        stage.render = render;
    })(stage = tileform.stage || (tileform.stage = {}));
    class shape_base {
        mesh;
        constructor() {
            this._create();
        }
        _create() { }
    }
    class shape_box extends shape_base {
        constructor() {
            super();
        }
        _create() {
            const box = new THREE.BoxGeometry(10, 16, 10);
            const material = new THREE.MeshPhongMaterial({
                color: 'red',
                //map: pipeline.loadTexture('img/moorish-ornaments.jpg', 0)
            });
            const mesh = new THREE.Mesh(box, material);
            this.mesh = mesh;
        }
    }
    function shapeMaker(type) {
        let shape;
        switch (type) {
            case 'nothing':
                console.warn(' no type passed to factory ');
                break;
            case 'wall':
                shape = new shape_box();
                break;
        }
        return shape;
    }
    ;
    class sprite3d extends sprite {
        target;
        shape;
        constructor(shape, data) {
            super(data);
            this.shape = shapeMaker(shape);
            this.renderCode();
            this.render();
        }
        _create() {
            super._create();
            // this.material.transparent = false;
            this.material.map = this.target.texture;
            this.material.needsUpdate = true;
            stage.group.position.set(0, 0, 0);
            stage.group.updateMatrix();
        }
        renderCode() {
            this.target = pipeline.makeRenderTarget(this.data.size[0], this.data.size[1]);
        }
        render() {
            stage.prepare(this);
            stage.render();
        }
    }
    tileform.sprite3d = sprite3d;
})(tileform || (tileform = {}));
export default tileform;
