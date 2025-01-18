/// This poorly named component turns basic models into tiles
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
        }
        function prepare(sprite) {
            stage.group.add(sprite.shape.mesh);
            pipeline.utilEraseChildren(stage.group);
        }
        stage.prepare = prepare;
        function render() {
            stage.renderer.setRenderTarget(stage.target);
            stage.renderer.clear();
            stage.renderer.render(stage.scene, stage.camera);
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
            const box = new THREE.BoxGeometry(10, 10, 10);
            const material = new THREE.MeshPhongMaterial({
                color: 'red',
                map: pipeline.loadTexture('img/moorish-ornaments.jpg', 0)
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
            this.material.map = this.target.texture;
        }
        renderCode() {
            this.target = pipeline.makeRenderTarget(this.data.size[0], this.data.size[1]);
        }
        render() {
            tileform.stage.prepare(this);
            tileform.stage.render();
        }
    }
    tileform.sprite3d = sprite3d;
})(tileform || (tileform = {}));
export default tileform;
