/// This poorly named component turns basic 3d shapes into sprites
import app from "../app.js";
import glob from "../dep/glob.js";
import { hooks } from "../dep/hooks.js";
import pts from "../dep/pts.js";
import rome from "../rome.js";
import pipeline from "./pipeline.js";
var tileform;
(function (tileform) {
    // This doesn't do anything but it's a cool ide
    const tfStretchSpace = 1;
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
    function projectSquareHex(w) {
        const width = 24;
        const height = 24;
        const x = w[0];
        const y = -w[1];
        return [
            (x - y) * (width / 2),
            (x + y) * (-height / 2) / 2
        ];
    }
    let stage;
    (function (stage) {
    })(stage = tileform.stage || (tileform.stage = {}));
    tileform.HexRotationX = 0.6135987755982989;
    tileform.HexRotationY = 1.045;
    let stageCameraRotation = Math.PI / 3;
    let wallRotationX = 9;
    let wallRotationY = 4;
    (function (stage) {
        function step() {
            opkl();
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
            //const testLight = new THREE.PointLight('red', 100000, 0);
            //testLight.distance = 0;
            //testLight.position.set(0, 100, 0);
            //const helper = new THREE.PointLightHelper(testLight, 30);
            stage.scene = new THREE.Scene();
            stage.scene.matrixWorldAutoUpdate = true;
            //scene.add(testLight);
            //scene.add(helper);
            // scene.background = new THREE.Color('purple');
            stage.camera = new THREE.OrthographicCamera(100 / -2, 100 / 2, 100 / 2, 100 / -2, -100, 100);
            stage.soleGroup = new THREE.Group();
            stage.lightsGroup = new THREE.Group();
            stage.scene.add(stage.soleGroup);
            stage.scene.add(stage.lightsGroup);
            stage.scene.updateMatrix();
            stage.ambient = new THREE.AmbientLight('white', 1);
            stage.scene.add(stage.ambient);
            const sunDistance = 2;
            stage.sun = new THREE.DirectionalLight('white', Math.PI / 3);
            stage.sun.position.set(-sunDistance / 6, sunDistance / 4, sunDistance);
            stage.scene.add(new THREE.AxesHelper(5));
            stage.scene.add(stage.sun);
            stage.scene.add(stage.camera);
            stage.scene.updateMatrix();
        }
        // aka stage
        function prepare(sprite) {
            stage.scene.scale.set(glob.scale, glob.scale, glob.scale);
            //scene.updateMatrix();
            //scene.updateMatrixWorld(true); // Wonky
            stage.spotlight = sprite;
            let { spriteSize: size } = sprite.data;
            size = (pts.mult(size, glob.scale));
            stage.camera = new THREE.OrthographicCamera(size[0] / -2, size[0] / 2, size[1] / 2, size[1] / -2, -100, 500);
            stage.camera.position.set(0, 1, 0); // Point the camera down at a dimetric rotation
            stage.camera.rotation.set(stageCameraRotation, 0, 0); // Dimetric rotation
            // scene.add(camera);
            // camera.position.y = 20 * glob.scale;
            // Translate
            const pos3d = (pts.mult(sprite.shape3d.pos3d, glob.scale));
            stage.camera.position.set(pos3d[0], pos3d[1], 0);
            //camera.updateMatrix();
            while (stage.soleGroup.children.length > 0)
                stage.soleGroup.remove(stage.soleGroup.children[0]);
            //soleGroup.add(lightsGroup);
            stage.soleGroup.add(sprite.shape3d.entityGroup);
            stage.soleGroup.updateMatrix();
            stage.soleGroup.updateMatrixWorld(true);
            stage.scene.updateMatrix();
            stage.scene.updateMatrixWorld(true);
            /*const { wpos } = sprite.gobj;
            const projected = (pts.mult(pts.project(wpos), tfMultiplier));
            soleGroup.position.set(projected[0], 0, projected[1]);*/
        }
        stage.prepare = prepare;
        function render() {
            // Todo: stage renderer doesn't render anything so use default
            glob.renderer.setRenderTarget(stage.spotlight.target);
            glob.renderer.clear();
            glob.renderer.render(stage.scene, stage.camera);
            glob.renderer.setRenderTarget(null);
            // console.log("Lights:", scene.children.filter(obj => obj.isLight));
        }
        stage.render = render;
    })(stage = tileform.stage || (tileform.stage = {}));
    // end of stage
    // shapes
    // Unused array
    const shapes = [];
    class entity3d {
        gobj;
        entityGroup;
        pos3d = [0, 0];
        constructor(gobj) {
            this.gobj = gobj;
            this.entityGroup = new THREE.Group();
        }
        translate() {
            // Translate so we can take lighting sources
            const { wpos } = this.gobj;
            this.pos3d = (pts.mult(projectSquareHex(wpos), tfStretchSpace));
            this.entityGroup.position.set(this.pos3d[0], this.pos3d[1], 0);
            this.entityGroup.updateMatrix();
        }
    }
    class shape3d extends entity3d {
        data;
        // _created
        constructor(data) {
            super(data.gobj);
            this.data = data;
            this.data = {
                shapeTexture: './img/textures/stonemixed.jpg',
                shapeGroundTexture: './img/textures/beachnormal.jpg',
                ...data
            };
            shapes.push(this);
        }
        step() {
            this._step();
        }
        create() {
            this._create();
            // this._created = true;
        }
        delete() {
            this._delete();
        }
        _create() {
            console.warn(' empty shape create ');
        }
        _delete() {
            console.warn(' empty shape delete ');
        }
        _step() { }
    }
    tileform.shape3d = shape3d;
    ;
    class shape_hex_wrapper extends shape3d {
        hexTile;
        constructor(data) {
            super(data);
        }
        _create() {
            this.hexTile = new hex_tile(this.data);
            this.entityGroup.add(this.hexTile.group);
            this.entityGroup.add(new THREE.AxesHelper(5));
            this.translate();
            // this.shapeGroup.updateMatrix();
        }
        _delete() {
            this.hexTile.free();
        }
    }
    tileform.shape_hex_wrapper = shape_hex_wrapper;
    tileform.hex_size = 7.7;
    class hex_tile {
        data;
        scalar = 8;
        group;
        mesh;
        constructor(data) {
            this.data = data;
            this.scalar = tileform.hex_size;
            this.make();
        }
        make() {
            const { scalar } = this;
            const vertices = [1 * scalar, 0 * scalar, 0 * scalar, 0.5 * scalar, 0.866 * scalar, 0 * scalar, -0.5 * scalar, 0.866 * scalar, 0 * scalar, -1 * scalar, 0 * scalar, 0 * scalar, -0.5 * scalar, -0.866 * scalar, 0 * scalar, 0.5 * scalar, -0.866 * scalar, 0 * scalar];
            const vertices2 = [1, 0, 0, 0.5, 0.866, 0, -0.5, 0.866, 0, -1, 0, 0, -0.5, -0.866, 0, 0.5, -0.866, 0];
            const indices = [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 1];
            const uvs = [0.5, 0, 1, 0.5, 0.75, 1, 0.25, 1, 0, 0.5, 0.25, 0, 0.75, 0];
            let geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            geometry.setIndex(indices);
            const normals = [];
            for (let i = 0; i < indices.length; i += 3) {
                // Define a flat normal pointing up (0, 1, 0) for each vertex in a face
                normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
            }
            geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
            const material = new THREE.MeshPhongMaterial({
                color: 'white',
                shininess: 0,
                map: pipeline.getTexture(this.data.shapeGroundTexture),
                // side: THREE.DoubleSide
            });
            // geometry = new THREE.PlaneGeometry(10, 10);
            // Now do the grouping
            this.group = new THREE.Group();
            // this.group.rotation.set(HexRotationX, HexRotationY, 0);
            this.mesh = new THREE.Mesh(geometry, material);
            this.group.add(this.mesh);
        }
        free() {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
        }
    }
    function shapeMaker(type, data) {
        let shape;
        switch (type) {
            case 'nothing':
                console.warn(' no shape type passed to factory ');
                break;
            case 'hex':
                shape = new shape_hex_wrapper(data);
                break;
            case 'wall':
                shape = new shape_wall(data);
                break;
        }
        return shape;
    }
    tileform.shapeMaker = shapeMaker;
    // boring wall geometries
    class shape_wall extends shape3d {
        hexTile;
        wallRotationGroup;
        mesh;
        constructor(data) {
            super(data);
        }
        _create() {
            //const geometry = wallMaker(this);
            const geometry = new THREE.SphereGeometry(8, 8, 8);
            const material = new THREE.MeshPhongMaterial({
                // color: this.data.gabeObject.data.colorOverride || 'white',
                // opacity: 0.8,
                transparent: true,
                map: pipeline.getTexture(this.data.shapeTexture)
            });
            // Make the merged geometries mesh
            const { shapeSize } = this.data;
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.position.set(0, shapeSize[1], 0);
            this.mesh.updateMatrix();
            // Make the base plate
            this.hexTile = new hex_tile(this.data);
            // Set up rotations
            this.wallRotationGroup = new THREE.Group();
            this.wallRotationGroup.add(this.mesh);
            this.entityGroup.add(this.wallRotationGroup);
            this.entityGroup.add(this.hexTile.group);
            // Translate so we can take lighting sources
            this.translate();
            //this.hexTile.rotationGroup.position.set(0, 0, 0);
            //this.hexTile.rotationGroup.updateMatrix();
            this._step();
        }
        free() {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
        }
        _delete() {
            this.hexTile.free();
            this.free();
        }
        _step() {
            //this.wallRotationGroup.rotation.set(Math.PI / wallRotationX, Math.PI / wallRotationY, 0);
            //this.wallRotationGroup.updateMatrix();
            this.entityGroup.updateMatrix();
        }
    }
    tileform.shape_wall = shape_wall;
    function wallMaker(wall) {
        let { shapeSize } = wall.data;
        const size = shapeSize;
        const geometries = [];
        // Hack!
        const directionAdapter = wall.data.gobj.directionAdapter;
        //console.log('shape wall create!', directionAdapter.directions);
        if (!directionAdapter) {
            console.warn(' no direction adapter for wallmaker');
            return;
        }
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
        if (!geometries.length)
            return;
        const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
        return mergedGeometry;
    }
    class shape_light_bad_idea extends shape3d {
        light;
        constructor(data) {
            super(data);
        }
        _create() {
        }
    }
    tileform.shape_light_bad_idea = shape_light_bad_idea;
    class light_source extends entity3d {
        data;
        light;
        constructor(data) {
            super(data.gobj);
            this.data = data;
            this.data = {
                radiance: 60,
                ...data
            };
        }
        create() {
            this._create();
        }
        delete() {
            this._delete();
        }
        update() {
            this._update();
        }
        _create() {
            console.log(' tf light source create ');
            this.light = new THREE.PointLight('cyan', 30000, 500);
            this.light.decay = 2.4;
            this.entityGroup.add(this.light);
            // Translate
            this.translate();
            this.entityGroup.position.z = 10;
            this.entityGroup.updateMatrix();
            stage.scene.add(this.entityGroup);
        }
        _delete() {
            console.log('remove light');
            // Todo there's a crash here without qm
            this.entityGroup.parent?.remove(this.entityGroup);
        }
        _update() {
        }
    }
    tileform.light_source = light_source;
    function opkl() {
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
        if (app.key('v') == 1) {
            if (stageCameraRotation > 0)
                stageCameraRotation -= .1;
            change = true;
        }
        if (app.key('b') == 1) {
            stageCameraRotation += .1;
            change = true;
        }
        if (!change)
            return;
        glob.rerender = true;
        rome.purgeRemake();
        console.log(wallRotationX, wallRotationY);
        console.log("stageCameraRotation", stageCameraRotation);
        //scene.rotation.set(Math.PI / rotationX, Math.PI / rotationY, 0);
        //scene.updateMatrix();
    }
})(tileform || (tileform = {}));
export default tileform;
