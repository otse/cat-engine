/// This poorly named component turns basic 3d shapes into sprites
import app from "../app.js";
import glob from "../dep/glob.js";
import { hooks } from "../dep/hooks.js";
import pts from "../dep/pts.js";
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
    const GreatRotationX = Math.PI / 6;
    const GreatRotationY = Math.PI / Math.PI;
    let wallRotationX = 9;
    let wallRotationY = 4;
    (function (stage) {
        function step() {
            let change = false;
            if (app.key('o') == 1) {
                wallRotationX -= 1;
                change = true;
            }
            if (app.key('p') == 1) {
                wallRotationX += 1;
                change = true;
            }
            if (app.key('k') == 1) {
                wallRotationY -= 1;
                change = true;
            }
            if (app.key('l') == 1) {
                wallRotationY += 1;
                change = true;
            }
            if (!change)
                return;
            glob.rerender = true;
            console.log(wallRotationX, wallRotationY);
            //scene.rotation.set(Math.PI / rotationX, Math.PI / rotationY, 0);
            //scene.updateMatrix();
        }
        stage.step = step;
        async function init() {
            await preload();
            await boot();
        }
        stage.init = init;
        async function preload() {
            await pipeline.preloadTextureAsync('./img/textures/stonemixed.jpg');
            await pipeline.preloadTextureAsync('./img/textures/beach.jpg');
            await pipeline.preloadTextureAsync('./img/textures/beachnormal.jpg');
            await pipeline.preloadTextureAsync('./img/textures/sand.jpg');
            //await pipeline.loadTextureAsync('./img/textures/sandnormal.jpg');
            await pipeline.preloadTextureAsync('./img/textures/oop.jpg');
            await pipeline.preloadTextureAsync('./img/textures/cobblestone.jpg');
            await pipeline.preloadTextureAsync('./img/textures/cobblestone2.jpg');
            await pipeline.preloadTextureAsync('./img/textures/basaltcliffs.jpg');
            await pipeline.preloadTextureAsync('./img/textures/cliffs.jpg');
            await pipeline.preloadTextureAsync('./img/textures/overgrown.jpg');
            //await pipeline.loadTextureAsync('./img/textures/bricks.jpg');
        }
        async function boot() {
            stage.scene = new THREE.Scene();
            // scene.background = new THREE.Color('purple');
            //scene.rotation.set(GreatRotationX, GreatRotationY, 0);
            stage.camera = new THREE.OrthographicCamera(100 / -2, 100 / 2, 100 / 2, 100 / -2, -100, 100);
            stage.putGroup = new THREE.Group();
            //defaultRotation.rotation.set(-Math.PI / 2, 0, 0);
            stage.putGroup.updateMatrix();
            stage.scene.add(stage.putGroup);
            stage.scene.updateMatrix();
            stage.ambient = new THREE.AmbientLight('white', Math.PI / 1);
            stage.scene.add(stage.ambient);
            const sunDistance = 100;
            stage.sun = new THREE.DirectionalLight('red', 1);
            stage.sun.position.set(-sunDistance, -sunDistance / 3, -sunDistance);
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
            set_preset(sprite.data_._scenePresetDepr);
            stage.spotlight = sprite;
            let { size } = sprite.data;
            size = pts.mult(size, glob.scale);
            stage.camera = new THREE.OrthographicCamera(size[0] / -2, size[0] / 2, size[1] / 2, size[1] / -2, -300, 300);
            while (stage.putGroup.children.length > 0)
                stage.putGroup.remove(stage.putGroup.children[0]);
            stage.putGroup.add(sprite.shape3d.group);
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
        _created;
        constructor(data) {
            this.data = data;
            this.data = {
                texture: './img/textures/stonemixed.jpg',
                hexTexture: './img/textures/beach.jpg',
                ...data
            };
            this.group = new THREE.Group();
            this.group.scale.set(glob.scale, glob.scale, glob.scale);
            this.group.add(new THREE.AxesHelper(2));
            this.group.updateMatrix();
            shapes.push(this);
            // this.create(); // Spike
        }
        step() {
            this._step();
        }
        create() {
            this._create();
            this._created = true;
        }
        _create() {
            console.warn(' empty shape create ');
        }
        _step() { }
    }
    tileform.shape_base = shape_base;
    class shape_hex_wrapper extends shape_base {
        hex;
        constructor(data) {
            super(data);
        }
        _create() {
            this.hex = new hex_tile(this.data);
            this.group.add(this.hex.rotationGroup);
            //this.hex.rotationGroup.position.set(0, 0, 0);
            //this.hex.rotationGroup.updateMatrix();
        }
    }
    tileform.shape_hex_wrapper = shape_hex_wrapper;
    tileform.hex_size = 8;
    class hex_tile {
        data;
        scalar = 8;
        rotationGroup;
        mesh;
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
                map: pipeline.getTexture(this.data.hexTexture),
            });
            this.rotationGroup = new THREE.Group();
            this.rotationGroup.rotation.set(GreatRotationX, GreatRotationY, 0);
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.rotation.set(-Math.PI / 2, 0, 0);
            this.mesh.updateMatrix();
            this.rotationGroup.add(this.mesh);
            this.rotationGroup.updateMatrix();
        }
    }
    function shapeMaker(type, data) {
        let shape;
        switch (type) {
            case 'nothing':
                console.warn(' no shape type passed to factory ');
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
        rotationGroup;
        constructor(data) {
            super(data);
        }
        _create() {
            const geometry = wallMaker(this);
            const material = new THREE.MeshPhongMaterial({
                // color: this.data.gabeObject.data.colorOverride || 'white',
                opacity: 1,
                transparent: true,
                map: pipeline.getTexture(this.data.texture)
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, 6, 0);
            mesh.updateMatrix();
            this.hexTile = new hex_tile(this.data);
            this.rotationGroup = new THREE.Group();
            this.rotationGroup.add(mesh);
            this.group.add(this.rotationGroup);
            this.group.add(this.hexTile.rotationGroup);
            this.hexTile.rotationGroup.position.set(0, 0, 0);
            this.hexTile.rotationGroup.updateMatrix();
            this.group.updateMatrix();
            this._step();
        }
        _step() {
            this.rotationGroup.rotation.set(Math.PI / wallRotationX, Math.PI / wallRotationY, 0);
            this.rotationGroup.updateMatrix();
            this.group.updateMatrix();
        }
    }
    tileform.shape_wall = shape_wall;
    function wallMaker(wall) {
        let { size } = wall.data;
        /*size = [
            size[0] * glob.scale,
            size[1] * glob.scale,
            size[2] * glob.scale];*/
        const geometries = [];
        // Hack!
        const directionAdapter = wall.data.gobj.directionAdapter;
        //console.log('shape wall create!', directionAdapter.directions);
        if (!directionAdapter) {
            console.warn(' no direction adapter for wallmaker');
            return;
        }
        switch (wall.data.type) {
            case 'concave':
                break;
            case 'regular':
                let geometry;
                if (directionAdapter.directions.includes('north')) {
                    geometry = new THREE.BoxGeometry(size[0] / 2, size[1], size[2] / 2);
                    geometry.translate(size[0] / 4, 0, size[2] / 4);
                    geometries.push(geometry);
                }
                if (directionAdapter.directions.includes('east')) {
                    geometry = new THREE.BoxGeometry(size[0] / 2, size[1], size[2] / 2);
                    geometry.translate(-size[0] / 4, 0, size[2] / 4);
                    geometries.push(geometry);
                }
                if (directionAdapter.directions.includes('south')) {
                    geometry = new THREE.BoxGeometry(size[0] / 2, size[1], size[2] / 2);
                    geometry.translate(-size[0] / 4, 0, size[2] / 4);
                    geometries.push(geometry);
                }
                if (directionAdapter.directions.includes('west')) {
                    geometry = new THREE.BoxGeometry(size[0] / 2, size[1], size[2] / 2);
                    geometry.translate(-size[0] / 4, 0, -size[2] / 4);
                    geometries.push(geometry);
                }
                if (directionAdapter.directions.includes('north') &&
                    directionAdapter.directions.includes('aest') ||
                    directionAdapter.directions.includes('east') &&
                        directionAdapter.directions.includes('south') ||
                    directionAdapter.directions.includes('south') &&
                        directionAdapter.directions.includes('west') ||
                    directionAdapter.directions.includes('west') &&
                        directionAdapter.directions.includes('north')) {
                    // Middle piece!
                    geometry = new THREE.BoxGeometry(size[0] / 2, size[1], size[2] / 2);
                    geometry.translate(-size[0] / 4, 0, size[2] / 4);
                    geometries.push(geometry);
                }
                break;
        }
        if (!geometries.length)
            return;
        const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
        return mergedGeometry;
    }
})(tileform || (tileform = {}));
export default tileform;
