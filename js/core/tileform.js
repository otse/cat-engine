/// This poorly named component turns basic 3d shapes into sprites
import app from "../app.js";
import glob from "../dep/glob.js";
import { hooks } from "../dep/hooks.js";
import pts from "../dep/pts.js";
import rome from "../rome.js";
import pipeline from "./pipeline.js";
var tileform;
(function (tileform) {
    tileform.SCENE_BASED_TILEFORM_POSITIONING = true;
    tileform.ALLOW_NORMAL_MAPS = true;
    // This doesn't do anything but it's a cool ide
    const StretchSpace = 1;
    async function init() {
        await stage.init();
        hooks.addListener('romeComponents', step);
        return;
    }
    tileform.init = init;
    async function step() {
        stage.step();
        update_entities();
        return false;
    }
    function update_entities() {
        // Updating is different from object-stepping
        for (const entity of entities) {
            entity.update();
        }
    }
    function project(w) {
        const tileWidth = glob.hexSize[0] - 1;
        const tileHeight = glob.hexSize[0] - 1;
        const x = w[0];
        const y = -w[1];
        const scaleFactor = tileWidth * 0.75;
        return [
            (x - y) * ((scaleFactor)),
            (x + y) * ((-tileHeight) / 2)
        ];
    }
    let stage;
    (function (stage) {
    })(stage = tileform.stage || (tileform.stage = {}));
    tileform.HexRotationX = 0.6135987755982989;
    tileform.HexRotationY = 1.045;
    let stageCameraRotation = 0.9471975511965977;
    let wallRotationX = -1;
    let wallRotationY = 6;
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
            await pipeline.preloadTextureAsync('./img/textures/stonemixednormal.jpg');
            await pipeline.preloadTextureAsync('./img/textures/stonemixed2.jpg');
            await pipeline.preloadTextureAsync('./img/textures/stonemixed2normal.jpg');
            await pipeline.preloadTextureAsync('./img/textures/cobblestone3.jpg');
            await pipeline.preloadTextureAsync('./img/textures/cobblestone3normal.jpg');
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
            // scene.fog = new THREE.Fog( 0xcccccc, 0, 5 );
            stage.scene.matrixWorldAutoUpdate = true;
            //scene.add(testLight);
            //scene.add(helper);
            // scene.background = new THREE.Color('purple');
            stage.camera = new THREE.OrthographicCamera(100 / -2, 100 / 2, 100 / 2, 100 / -2, -100, 100);
            stage.soleGroup = new THREE.Group();
            //soleGroup.rotation.y = Math.PI / 2;
            stage.lightsGroup = new THREE.Group();
            stage.scene.add(stage.soleGroup);
            stage.scene.add(stage.lightsGroup);
            stage.scene.updateMatrix();
            stage.ambient = new THREE.AmbientLight('white', 1);
            stage.scene.add(stage.ambient);
            const sunDistance = 2;
            stage.sun = new THREE.DirectionalLight('white', Math.PI / 3);
            stage.sun.position.set(-sunDistance / 6, sunDistance / 4, sunDistance);
            stage.sun.updateMatrix();
            // scene.add(new THREE.AxesHelper(5));
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
            stage.camera.position.set(0, 0, 1);
            stage.camera.rotation.set(stageCameraRotation, 0, 0);
            const pos3d = (pts.mult(sprite.shape.pos3d, glob.scale));
            stage.camera.position.set(pos3d[0], pos3d[1], 0);
            stage.camera.updateMatrix();
            while (stage.soleGroup.children.length > 0)
                stage.soleGroup.remove(stage.soleGroup.children[0]);
            stage.soleGroup.add(sprite.shape.entityGroup);
            stage.soleGroup.updateMatrix();
            stage.scene.updateMatrix();
            stage.scene.updateMatrixWorld(true);
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
    const shapes = [];
    const entities = [];
    class entity3d {
        gobj;
        entityGroup;
        pos3d = [0, 0];
        constructor(gobj) {
            this.gobj = gobj;
            this.entityGroup = new THREE.Group();
            entities.push(this);
        }
        create() {
            this._create();
        }
        delete() {
            this.free();
            this._delete();
        }
        step() {
            this._step();
        }
        update() {
            this._update();
        }
        free() {
            const index = entities.indexOf(this);
            if (index !== -1) {
                entities.splice(index, 1);
            }
        }
        _create() {
            console.warn('empty entity create');
        }
        _delete() {
            console.warn('empty entity delete');
        }
        _step() {
        }
        _update() {
        }
        translate() {
            // Useful for beautiful lighting
            const { wpos } = this.gobj;
            const pos = this.pos3d = (pts.mult(project(wpos), StretchSpace));
            this.entityGroup.position.fromArray([...pos, 0]);
            this.entityGroup.updateMatrix();
        }
    }
    class shape3d extends entity3d {
        data;
        constructor(data) {
            super(data.gobj);
            this.data = data;
            this.data = {
                shapeTexture: './img/textures/stonemixed.jpg',
                shapeGroundTexture: './img/textures/beachnormal.jpg',
                shapeGroundTextureNormal: './img/textures/beachnormal.jpg',
                ...data
            };
        }
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
            // this.entityGroup.add(new THREE.AxesHelper(8));
            this.translate();
        }
        _delete() {
            this.hexTile.free();
        }
    }
    tileform.shape_hex_wrapper = shape_hex_wrapper;
    tileform.hex_size = 7.9;
    class hex_tile {
        data;
        scalar;
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
                specular: 'black',
                shininess: 0,
                map: pipeline.getTexture(this.data.shapeGroundTexture),
                normalScale: new THREE.Vector2(1, 1),
                normalMap: tileform.ALLOW_NORMAL_MAPS ? pipeline.getTexture(this.data.shapeGroundTextureNormal) : null,
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
            const geometry = wallMaker(this);
            //const geometry = new THREE.SphereGeometry(8, 8, 8);
            const material = new THREE.MeshPhongMaterial({
                // color: this.data.gabeObject.data.colorOverride || 'white',
                // opacity: 0.8,
                transparent: true,
                map: pipeline.getTexture(this.data.shapeTexture)
            });
            // Make the merged geometries mesh
            const { shapeSize } = this.data;
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.updateMatrix();
            // Make the base plate
            this.hexTile = new hex_tile(this.data);
            // Set up rotations
            this.wallRotationGroup = new THREE.Group();
            this.wallRotationGroup.add(this.mesh);
            this.wallRotationGroup.position.z = shapeSize[2];
            this.entityGroup.add(this.wallRotationGroup);
            this.entityGroup.add(this.hexTile.group);
            // Translate so we can take lighting sources
            this.translate();
            //this.hexTile.rotationGroup.position.set(0, 0, 0);
            //this.hexTile.rotationGroup.updateMatrix();
            this._step();
        }
        dispose() {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
        }
        _delete() {
            this.dispose();
            this.hexTile.free();
        }
        _step() {
            this.wallRotationGroup.rotation.set(0, 0, Math.PI / wallRotationY);
            this.wallRotationGroup.updateMatrix();
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
            geometry = new THREE.BoxGeometry(size[0] / 2, size[1] / 2, size[2]);
            geometry.translate(size[0] / 4, size[1] / 4, 0);
            geometries.push(geometry);
        }
        if (directionAdapter.directions.includes('east')) {
            geometry = new THREE.BoxGeometry(size[0] / 2, size[1] / 2, size[2]);
            geometry.translate(-size[0] / 4, size[1] / 4, 0);
            geometries.push(geometry);
        }
        if (directionAdapter.directions.includes('south')) {
            geometry = new THREE.BoxGeometry(size[0] / 2, size[1] / 2, size[2]);
            geometry.translate(-size[0] / 4, size[1] / 4, 0);
            geometries.push(geometry);
        }
        if (directionAdapter.directions.includes('west')) {
            geometry = new THREE.BoxGeometry(size[0] / 2, size[1] / 2, size[2]);
            geometry.translate(-size[0] / 4, -size[1] / 4, 0);
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
            geometry = new THREE.BoxGeometry(size[0] / 2, size[1] / 2, size[2]);
            geometry.translate(-size[0] / 4, size[1] / 4, 0);
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
        wpos2;
        light;
        constructor(data) {
            super(data.gobj);
            this.data = data;
            this.data = {
                radiance: 60,
                ...data
            };
            this.wpos2 = pts.copy(this.gobj.wpos);
        }
        step() {
            this._step();
        }
        _step() {
        }
        _update() {
            // Dance the light source
            this.light.position.x = 4;
            this.light.updateMatrix();
            const secondsPerRotation = 4;
            this.entityGroup.rotation.z += (Math.PI * 2) * (1 / secondsPerRotation * glob.delta);
            //this.entityGroup.position.x += glob.delta;
            this.entityGroup.updateMatrix();
            this.light.updateMatrix();
            glob.rerender = true;
            glob.rerenderGame = true;
        }
        _delete() {
            console.log('remove light');
            stage.lightsGroup.remove(this.entityGroup);
        }
        _create() {
            console.log(' tf light source create ');
            this.light = new THREE.PointLight('cyan', 1, 5);
            // this.light.decay = 2.4;
            this.light.intensity = 10000 * glob.scale;
            this.light.distance = 600 * glob.scale;
            this.light.decay = 1.8;
            this.light.updateMatrix();
            this.entityGroup.add(this.light);
            // Translate
            this.translate();
            this.entityGroup.position.z = 10;
            this.entityGroup.updateMatrix();
            this.entityGroup.updateMatrixWorld(true); // Bad
            stage.lightsGroup.add(this.entityGroup);
        }
    }
    tileform.light_source = light_source;
    function opkl() {
        let change = false;
        if (app.key('f3') == 1) {
            tileform.ALLOW_NORMAL_MAPS = !tileform.ALLOW_NORMAL_MAPS;
        }
        else if (app.key('o') == 1) {
            wallRotationX -= 1;
        }
        else if (app.key('p') == 1) {
            wallRotationX += 1;
        }
        else if (app.key('k') == 1) {
            wallRotationY -= 1;
        }
        else if (app.key('l') == 1) {
            wallRotationY += 1;
        }
        else if (app.key('v') == 1) {
            if (stageCameraRotation > 0)
                stageCameraRotation -= .1;
        }
        else if (app.key('b') == 1) {
            stageCameraRotation += .1;
        }
        else {
            return;
        }
        glob.rerender = true;
        rome.purgeRemake();
        console.log(wallRotationX, wallRotationY);
        console.log("stageCameraRotation", stageCameraRotation);
    }
})(tileform || (tileform = {}));
export default tileform;
