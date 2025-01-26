/// This poorly named component turns basic 3d shapes into sprites
import app from "../app.js";
import glob from "../dep/glob.js";
import { hooks } from "../dep/hooks.js";
import pipeline from "./pipeline.js";
var tileform;
(function (tileform) {
    async function init() {
        await stage.init();
        hooks.addListener('romeComponents', step);
        return;
    }
    tileform.init = init;
    async function step() {
        stage.step();
        return false;
    }
    let stage;
    (function (stage) {
    })(stage = tileform.stage || (tileform.stage = {}));
    (function (stage) {
        let rotationX = 1;
        let rotationY = 1;
        function step() {
            let change = false;
            if (app.key('o') == 1) {
                rotationX -= 1;
                change = true;
            }
            if (app.key('p') == 1) {
                rotationX += 1;
                change = true;
            }
            if (app.key('k') == 1) {
                rotationY -= 1;
                change = true;
            }
            if (app.key('l') == 1) {
                rotationY += 1;
                change = true;
            }
            if (!change)
                return;
            console.log(rotationX, rotationY);
            stage.scene.rotation.set(Math.PI / rotationX, Math.PI / rotationY, 0);
            stage.scene.updateMatrix();
        }
        stage.step = step;
        async function init() {
            await preload();
            await boot();
        }
        stage.init = init;
        async function preload() {
            await pipeline.loadTextureAsync('./img/textures/stonemixed.jpg');
            await pipeline.loadTextureAsync('./img/textures/beach.jpg');
            await pipeline.loadTextureAsync('./img/textures/beachnormal.jpg');
            await pipeline.loadTextureAsync('./img/textures/sand.jpg');
            //await pipeline.loadTextureAsync('./img/textures/sandnormal.jpg');
            await pipeline.loadTextureAsync('./img/textures/oop.jpg');
        }
        async function boot() {
            stage.scene = new THREE.Scene();
            // scene.background = new THREE.Color('purple');
            stage.scene.rotation.set(Math.PI / 6, Math.PI / Math.PI, 0);
            stage.camera = new THREE.OrthographicCamera(100 / -2, 100 / 2, 100 / 2, 100 / -2, -100, 100);
            stage.mainGroup = new THREE.Group();
            //defaultRotation.rotation.set(-Math.PI / 2, 0, 0);
            stage.mainGroup.updateMatrix();
            stage.scene.add(stage.mainGroup);
            stage.scene.updateMatrix();
            stage.ambient = new THREE.AmbientLight('white', Math.PI);
            stage.scene.add(stage.ambient);
            const sunDistance = 100;
            stage.sun = new THREE.DirectionalLight('white', 1);
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
        function set_preset(scenePreset) {
            switch (scenePreset) {
                case 'hex':
                    //majorGroup.rotation.set(Math.PI / 6, Math.PI / Math.PI, 0);
                    break;
                case 'wall':
                    //majorGroup.rotation.set(Math.PI / 6, 1, 0);
                    break;
            }
            //majorGroup.updateMatrix();
        }
        function prepare(sprite) {
            set_preset(sprite.data.scenePreset);
            stage.spotlight = sprite;
            const size = sprite.data.size;
            stage.camera = new THREE.OrthographicCamera(size[0] / -2, size[0] / 2, size[1] / 2, size[1] / -2, -100, 100);
            while (stage.mainGroup.children.length > 0)
                stage.mainGroup.remove(stage.mainGroup.children[0]);
            stage.mainGroup.add(sprite.shape.group);
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
    const shapes = [];
    class shape_base {
        data;
        group;
        constructor(data) {
            this.data = data;
            this.data = {
                texture: './img/textures/stonemixed.jpg',
                hexTexture: './img/textures/beach.jpg',
                ...data
            };
            this.group = new THREE.Group();
            shapes.push(this);
            this._create();
        }
        _create() { }
        step() { }
    }
    tileform.shape_base = shape_base;
    class shape_hex_wrapper extends shape_base {
        hex;
        constructor(data) {
            super(data);
            this._create();
        }
        _create() {
            this.hex = new hex_tile(this.data);
            this.group.add(this.hex.get(this));
            this.hex.mesh.position.set(0, 0, 0);
            this.hex.mesh.updateMatrix();
        }
    }
    tileform.shape_hex_wrapper = shape_hex_wrapper;
    tileform.hex_size = 8;
    class hex_tile {
        data;
        mesh;
        scalar = 8;
        constructor(data) {
            this.data = data;
            this.scalar = tileform.hex_size;
            this.make();
        }
        make() {
            const { scalar } = this;
            const vertices = [1 * scalar, 0 * scalar, 0 * scalar, 0.5 * scalar, 0.866 * scalar, 0 * scalar, -0.5 * scalar, 0.866 * scalar, 0 * scalar, -1 * scalar, 0 * scalar, 0 * scalar, -0.5 * scalar, -0.866 * scalar, 0 * scalar, 0.5 * scalar, -0.866 * scalar, 0 * scalar];
            const indices = [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 1];
            const uvs = [0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1];
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            geometry.setIndex(indices);
            const material = new THREE.MeshPhongMaterial({
                color: 'white',
                map: pipeline.loadTexture(this.data.hexTexture, 0),
            });
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.rotation.set(-Math.PI / 2, 0, 0);
            this.mesh.updateMatrix();
        }
        get(shape) {
            return this.mesh;
        }
    }
    function shapeMaker(type, data) {
        let shape;
        switch (type) {
            case 'nothing':
                console.warn(' no type passed to factory ');
                break;
            case 'wall':
                shape = new shape_wall(data);
                break;
            case 'hex':
                shape = new shape_hex_wrapper(data);
                break;
        }
        return shape;
    }
    tileform.shapeMaker = shapeMaker;
    // boring wall geometries
    class shape_wall extends shape_base {
        hexTile;
        constructor(data) {
            super(data);
            this._create();
        }
        _create() {
            const { size } = this.data;
            const geometry = wall_geometry_builder(this);
            const material = new THREE.MeshPhongMaterial({
                //color: 'red',
                map: pipeline.loadTexture(this.data.texture, 1)
            });
            const mesh = new THREE.Mesh(geometry, material);
            this.hexTile = new hex_tile(this.data);
            const wallRotation = new THREE.Group();
            wallRotation.add(mesh);
            wallRotation.rotation.set(0, Math.PI / 3, 0);
            wallRotation.updateMatrix();
            this.group.add(this.hexTile.mesh);
            this.hexTile.mesh.position.set(0, 0, -7);
            this.hexTile.mesh.updateMatrix();
            this.group.add(wallRotation);
            this.group.updateMatrix();
        }
    }
    tileform.shape_wall = shape_wall;
    function wall_geometry_builder(wall) {
        const { size } = wall.data;
        const geometries = [];
        switch (wall.data.type) {
            case 'concave':
                break;
            case 'regular':
                const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
                geometries.push(geometry);
                break;
        }
        const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
        return mergedGeometry;
    }
})(tileform || (tileform = {}));
export default tileform;
