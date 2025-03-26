/// This poorly named component turns basic 3d shapes into sprites
import app from "../app.js";
import glob from "./../dep/glob.js";
import { hooks } from "../dep/hooks.js";
import pts from "../dep/pts.js";
import rome from "../rome.js";
import pipeline from "./pipeline.js";
var tileform;
(function (tileform) {
    // right now, light is uniform and the camera sits right on top of the tile
    // instead of putting the camera at pan.rpos then offsetting the scene
    // just leave to true
    tileform.PUT_CAMERA_ON_TILE = true;
    // using math based entirely on trial and error
    // i managed to create a sun that doesn't render uniformly
    // setting this is nice but requires reprerenders
    tileform.TOGGLE_SUN_CAMERA = false;
    // this switch enables lights to "act more 3d"
    // by raising individual lights the further they are from the camera
    // this is just an idea and doesn't work yet
    tileform.lyftLightSourcesFromCamera = false;
    // like it says this toggles the beau ti ful relief maps
    tileform.TOGGLE_NORMAL_MAPS = true;
    // once i realized the projection function pretended that tiles were dimetric
    // but could be uniform hexagons, this only sets the stage camera to top down,
    // then sets the global hex size to equal width and height
    tileform.TOGGLE_TOP_DOWN_MODE = false;
    // beautiful red green blues
    tileform.TOGGLE_RENDER_AXES = false;
    // i know directional lights are supposed to cast light uniformly
    // but they actually act more like giant point lights
    // this setting defines the size of the sun orb
    const sunDistance = 20;
    // the idea was to create a spread between tiles
    // so that the lighting would behave better
    // don't use
    const stretchSpace = 1;
    const wallRotation = Math.PI / 6;
    const wallRotationStaggered = Math.PI / 6;
    async function init() {
        await stage.init();
        hooks.addListener('romeComponents', step);
        glob.wallrotation = wallRotation;
        glob.wallrotationstaggered = wallRotationStaggered;
        make_pan_compressor_line();
        //hooks.addListener('chunkShow', chunkShow);
        return;
    }
    tileform.init = init;
    function purge() {
        make_pan_compressor_line();
        pipeline.utilEraseChildren(pipeline.groups.monolith);
        pipeline.utilEraseChildren(stage.lightsGroup);
    }
    tileform.purge = purge;
    let tfCompressor;
    function make_pan_compressor_line() {
        // Create a simple geometry with two points
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            0, 0, 0,
            0, 1, 0
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        // Create a line material
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        // Create the line
        const line = new THREE.Line(geometry, material);
        tfCompressor = line;
        // Add to scene
        // pipeline.scene.add(line);
    }
    function get_compressor_distance() {
        const screenCoords = getVerticalScreenDifference(tfCompressor.geometry, tfCompressor, pipeline.camera, pipeline.renderer);
        glob.pancompress = -1 / screenCoords.y;
    }
    function worldToScreen(vertex, camera, renderer) {
        const vector = vertex.clone().project(camera); // Project to NDC space
        // Convert NDC to screen coordinates
        const halfWidth = renderer.domElement.width / 2;
        const halfHeight = renderer.domElement.height / 2;
        return new THREE.Vector2((vector.x * halfWidth) + halfWidth, (-vector.y * halfHeight) + halfHeight // Flip Y for screen coordinates
        );
    }
    function getVerticalScreenDifference(geometry, object, camera, renderer) {
        const positions = geometry.attributes.position;
        // Ensure we have at least 2 vertices
        if (positions.count < 2) {
            console.error("Geometry does not have enough vertices.");
            return null;
        }
        // Get the world positions of the first two vertices
        const vertex0 = new THREE.Vector3().fromBufferAttribute(positions, 0).applyMatrix4(object.matrixWorld);
        const vertex1 = new THREE.Vector3().fromBufferAttribute(positions, 1).applyMatrix4(object.matrixWorld);
        // Convert them to screen space
        const screen0 = worldToScreen(vertex0, camera, renderer);
        const screen1 = worldToScreen(vertex1, camera, renderer);
        // Compute difference
        return new THREE.Vector2().subVectors(screen1, screen0);
    }
    async function step() {
        pipeline.scene.scale.set(glob.scale, glob.scale, glob.scale);
        stage.step();
        update_entities();
        get_compressor_distance();
        return false;
    }
    function update_entities() {
        // Updating is different from object-stepping
        for (const entity of entities) {
            entity.update();
        }
    }
    // This function does almost nothing! It doesn't matter where we project apparently
    function project_linear_space(w) {
        const tileWidth = glob.hexsize[0] - 1;
        const tileHeight = glob.hexsize[0] - 1;
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
    tileform.tfStageCameraRotation = 0.98;
    (function (stage) {
        function step() {
            opkl();
            // Testing new lighting mode
            //glob.reprerender = true;
            //glob.dirtyobjects = true;
        }
        stage.step = step;
        async function init() {
            await preload();
            await boot();
            // glob.camerarotationx = tfStageCameraRotation;
        }
        stage.init = init;
        async function preload() {
            await pipeline.preloadTextureAsync('./img/textures/water.jpg');
            await pipeline.preloadTextureAsync('./img/textures/overgrown_x.jpg');
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
            // await pipeline.preloadTextureAsync('./img/textures/overgrown.jpg');
            //await pipeline.loadTextureAsync('./img/textures/bricks.jpg');
        }
        async function boot() {
            stage.sun = new THREE.DirectionalLight('lavender', Math.PI / 3);
            pipeline.scene.add(stage.sun);
            pipeline.scene.add(stage.sun.target);
        }
    })(stage = tileform.stage || (tileform.stage = {}));
    // end of stage
    const entities = [];
    class entity3d {
        gobj;
        entityGroup;
        pos3d = [0, 0];
        z = 0;
        constructor(gobj) {
            this.gobj = gobj;
            this.entityGroup = new THREE.Group();
            entities.push(this);
        }
        _monolithAdd() {
            pipeline.groups.monolith.add(this.entityGroup);
        }
        _monolithRemove() {
            this.entityGroup.parent.remove(this.entityGroup);
        }
        create() {
            this._create();
            this._monolithAdd();
        }
        delete() {
            this.free();
            this._delete();
            this._monolithRemove();
        }
        step() {
            this._step();
            this.translate(); // Mono debug
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
            const { wpos } = this.gobj;
            let pos = this.pos3d = pts.project(wpos);
            pos[1] = rome.roundToNearest(pos[1], glob.pancompress);
            // pos = pts.ceil(pos);
            this.entityGroup.position.fromArray([...pos, this.z]);
            this.entityGroup.updateMatrix();
        }
    }
    class shape3d extends entity3d {
        data;
        constructor(data) {
            super(data.gobj);
            this.data = data;
            this.data = {
                shapeTexture: './img/textures/cobblestone3.jpg',
                shapeTextureNormal: './img/textures/stonemixednormal.jpg',
                shapeGroundTexture: './img/textures/stonemixed2.jpg',
                shapeGroundTextureNormal: './img/textures/stonemixed2normal.jpg',
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
            if (tileform.TOGGLE_RENDER_AXES)
                this.entityGroup.add(new THREE.AxesHelper(12));
            this.translate();
        }
        _delete() {
            this.hexTile.free();
        }
    }
    tileform.shape_hex_wrapper = shape_hex_wrapper;
    tileform.hexscalar = 7.1;
    class hex_tile {
        data;
        scalar;
        group;
        mesh;
        constructor(data) {
            this.data = data;
            this.scalar = tileform.hexscalar;
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
                specular: 'green',
                shininess: 7,
                normalScale: new THREE.Vector2(.5, .5),
                map: pipeline.getTexture(this.data.shapeGroundTexture),
                normalMap: pipeline.getTexture(this.data.shapeGroundTextureNormal),
            });
            if (!tileform.TOGGLE_NORMAL_MAPS)
                material.normalMap = null;
            // geometry = new THREE.PlaneGeometry(10, 10);
            this.group = new THREE.Group();
            this.group.scale.set(1, 1, 1);
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
        // console.log('shapeMaker', data);
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
        stagger = false;
        hexTile;
        rotationGroup;
        wallGroup;
        wallMaterial;
        constructor(data) {
            super(data);
        }
        _create() {
            const { shapeSize } = this.data;
            const material = new THREE.MeshPhongMaterial({
                // color: 'red',
                map: pipeline.getTexture(this.data.shapeTexture),
                normalMap: pipeline.getTexture(this.data.shapeTextureNormal)
            });
            if (!tileform.TOGGLE_NORMAL_MAPS)
                material.normalMap = null;
            this.hexTile = new hex_tile(this.data);
            this.wallGroup = wallMaker(this, material);
            this.wallGroup.position.set(5, 4, 0); // Push it up
            this.wallGroup.updateMatrix();
            this.rotationGroup = new THREE.Group();
            this.rotationGroup.add(this.wallGroup);
            this.rotationGroup.position.z = shapeSize[2] / 2;
            this.entityGroup.add(this.rotationGroup);
            this.entityGroup.add(this.hexTile.group);
            if (tileform.TOGGLE_RENDER_AXES)
                this.entityGroup.add(new THREE.AxesHelper(12));
            // Translate so we can take lighting sources
            this.translate();
            //this.hexTile.rotationGroup.position.set(0, 0, 0);
            //this.hexTile.rotationGroup.updateMatrix();
            this._step();
            this.wallMaterial = material;
        }
        dispose() {
            //this.wallGroups.geometry.dispose();
            this.wallMaterial.dispose();
        }
        _delete() {
            this.dispose();
            this.hexTile.free();
        }
        _step() {
            this.rotationGroup.rotation.set(0, 0, glob.wallrotation);
            this.rotationGroup.updateMatrix();
            this.entityGroup.updateMatrix();
        }
    }
    tileform.shape_wall = shape_wall;
    function wallMaker(shape, material) {
        let { shapeSize } = shape.data;
        const size = shapeSize;
        const group = new THREE.Group();
        const gobj = shape.data.gobj;
        const wall3d = gobj;
        const adapter = wall3d.wallAdapter;
        const staggerData = wall3d.data.extra.staggerData;
        if (!adapter) {
            console.warn(' no direction adapter for wallmaker ');
            return;
        }
        const interpol = (gobj, to, from) => {
            const fromObjects = adapter.get_all_objects_at(from);
            const toObjects = adapter.get_all_objects_at(to);
            const fromObject = fromObjects[0];
            const toObject = toObjects[0];
            const ourPosition = project_linear_space(gobj.wpos);
            const fromPosition = project_linear_space(fromObject.wpos);
            const toPosition = project_linear_space(toObject.wpos);
            let midX = ((fromPosition[0] + toPosition[0]) / 2) - ourPosition[0];
            let midY = ((fromPosition[1] + toPosition[1]) / 2) - ourPosition[1];
            let midPoint = [midX, midY];
            midPoint = pts.round(midPoint);
            return midPoint;
        };
        let geometry, mesh;
        // Outward stagger
        // Tiles above and to the lower right
        if (adapter.tile_occupied('northwest') &&
            adapter.tile_occupied('east')) {
            let point = interpol(wall3d, 'northwest', 'east');
            if (staggerData?.isNorth) {
                //point = pts.add(point, [-size[1] / 2, 0]);
            }
            point = pts.add(point, [-3, -4]);
            geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
            mesh = new THREE.Mesh(geometry, material);
            //mesh.position.set(-size[0] / 2 + size[0] / magic, 0, 0);
            mesh.position.set(point[0], point[1], 0);
            mesh.rotation.set(0, 0, Math.PI / 2);
            mesh.updateMatrix();
            group.add(mesh);
        }
        // Inward stagger
        // Tiles to the top left and to the bottom
        else if (adapter.tile_occupied('west') &&
            adapter.tile_occupied('southeast')) {
            let point = [0, 0];
            if (staggerData?.isNorth) {
                //point = pts.add(point, [-size[1] / 2, 0]);
            }
            // let point = interpol(wall3d, 'west', 'southeast');
            point = pts.add(point, [-4, 0]);
            geometry = new THREE.BoxGeometry(size[0] / 2, size[1], size[2]);
            // material.color = new THREE.Color('red');
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(point[0], point[1], 0);
            mesh.rotation.set(0, 0, Math.PI / 2);
            mesh.updateMatrix();
            group.add(mesh);
        }
        if (adapter.tile_occupied('north')) {
            geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
            // geometry.translate(0, 0, 0);
            mesh = new THREE.Mesh(geometry, material);
            // mesh.rotation.set(0, 0, Math.PI / 2);
            group.add(mesh);
        }
        if (adapter.tile_occupied('south')) {
            geometry = new THREE.BoxGeometry(size[0] / 2, size[1], size[2]);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(-size[0] / 4, 0, 0);
            mesh.updateMatrix();
            group.add(mesh);
        }
        /*if (adapter.tile_occupied('east')) {
            geometry = new THREE.BoxGeometry(size[0] / 2, size[1] / 2, size[2]);
            geometry.translate(-size[0] / 4, size[1] / 4, 0);
            geometries.push(geometry);
        }*/
        /*if (adapter.tile_occupied('west')) {
            geometry = new THREE.BoxGeometry(size[0] / 2, size[1] / 2, size[2]);
            geometry.translate(-size[0] / 4, -size[1] / 4, 0);
            geometries.push(geometry);
        }*/
        if (adapter.tile_occupied('north') &&
            adapter.tile_occupied('east') ||
            adapter.tile_occupied('east') &&
                adapter.tile_occupied('south') ||
            adapter.tile_occupied('south') &&
                adapter.tile_occupied('west') ||
            adapter.tile_occupied('west') &&
                adapter.tile_occupied('north')) {
            // Middle piece!
            geometry = new THREE.BoxGeometry(size[0] / 2, size[1] / 2, size[2]);
            geometry.translate(-size[0] / 4, size[1] / 4, 0);
            // geometries.push(geometry);
        }
        //if (!geometries.length)
        //	return;
        //const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
        //return mergedGeometry;
        return group;
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
        lyft(pos) {
            // Experimental
            this.entityGroup.position.z += 1;
        }
        _step() {
        }
        _update() {
            // Dance the light source
            //glob.reprerender = true;
            //glob.dirtyobjects = true;
            //return;
            this.light.position.x = 3;
            this.light.updateMatrix();
            const secondsPerRotation = 4;
            this.entityGroup.rotation.z += (Math.PI * 2) * (1 / secondsPerRotation * glob.delta);
            //this.entityGroup.position.x += glob.delta;
            this.entityGroup.updateMatrix();
            this.light.updateMatrix();
            glob.reprerender = true;
            glob.dirtyobjects = true;
        }
        _delete() {
            console.log('remove light');
            // super._delete();
        }
        _create() {
            console.log(' tf light source create ');
            this.light = new THREE.PointLight('gold', 1, 5);
            // this.light.decay = 2.4;
            this.light.intensity = 700 * (glob.scale * 2);
            this.light.distance = 600 * (glob.scale * 2);
            this.light.decay = 2.3;
            this.light.updateMatrix();
            this.entityGroup.add(this.light);
            // Translate
            this.z = 4;
            this.translate();
            this.entityGroup.updateMatrix();
            // this.entityGroup.updateMatrixWorld(true); // Bad
            pipeline.groups.monolith.add(this.entityGroup);
            glob.reprerender = true;
            glob.dirtyobjects = true;
        }
    }
    tileform.light_source = light_source;
    function opkl() {
        if (app.key('f1') == 1) {
            tileform.TOGGLE_TOP_DOWN_MODE = !tileform.TOGGLE_TOP_DOWN_MODE;
            if (tileform.TOGGLE_TOP_DOWN_MODE) {
                glob.camerarotationx = 0;
            }
            else {
                glob.camerarotationx = Math.PI / 3;
            }
        }
        else if (app.key('f2') == 1) {
            tileform.TOGGLE_RENDER_AXES = !tileform.TOGGLE_RENDER_AXES;
        }
        else if (app.key('f3') == 1) {
            tileform.TOGGLE_NORMAL_MAPS = !tileform.TOGGLE_NORMAL_MAPS;
        }
        else if (app.key('f4') == 1) {
            tileform.TOGGLE_SUN_CAMERA = !tileform.TOGGLE_SUN_CAMERA;
        }
        else if (app.key('k') == 1) {
            glob.wallrotation -= .01;
        }
        else if (app.key('l') == 1) {
            glob.wallrotation += .01;
        }
        else if (app.key('v') == 1) {
            if (glob.camerarotationx > 0)
                glob.camerarotationx -= .01;
        }
        else if (app.key('b') == 1) {
            glob.camerarotationx += .01;
        }
        else if (app.key('q') == 1) {
            glob.hexsize = pts.add(glob.hexsize, [0, 1]);
        }
        else if (app.key('a') == 1) {
            glob.hexsize = pts.add(glob.hexsize, [0, -1]);
        }
        else if (app.key('1') == 1) {
            glob.hexsize = pts.add(glob.hexsize, [-1, 0]);
        }
        else if (app.key('2') == 1) {
            glob.hexsize = pts.add(glob.hexsize, [1, 0]);
        }
        else {
            return;
        }
        rome.purgeRemake();
    }
})(tileform || (tileform = {}));
export default tileform;
