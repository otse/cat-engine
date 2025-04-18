import app from "../app.js";
import glob from "./../dep/glob.js";
import pts from "../dep/pts.js";
import worldetch from "../worldetch.js";
import renderer from "./renderer.js";
import worldetch__ from "./worldetch.js";
// Welcome to the chaos of worldetch! 🌍🔥
var tileform;
(function (tileform) {
    tileform.TOGGLE_NORMAL_MAPS = true;
    tileform.TOGGLE_TOP_DOWN_MODE = false;
    tileform.TOGGLE_RENDER_AXES = false;
    const wallRotation = Math.PI / 6;
    const wallRotationStaggered = Math.PI / 6;
    async function init() {
        await preload();
        await boot();
        glob.wallrotation = wallRotation;
        glob.wallrotationstaggered = wallRotationStaggered;
        make_pan_compressor_line();
        //hooks.addListener('chunkShow', chunkShow);
    }
    tileform.init = init;
    function purge() {
        renderer.utilEraseChildren(renderer.groups.monolith);
        make_pan_compressor_line();
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
        // renderer.scene.add(line);
    }
    function get_compressor_distance() {
        const screenCoords = getVerticalScreenDifference(tfCompressor.geometry, tfCompressor, renderer.camera, renderer.renderer);
        worldetch__.pan_compress = -1 / screenCoords.y;
        console.log(screenCoords, worldetch__.pan_compress);
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
    function step() {
        renderer.scene.scale.set(worldetch__.scale, worldetch__.scale, worldetch__.scale);
        get_compressor_distance();
        opkl();
        // Testing new lighting mode
    }
    tileform.step = step;
    async function preload() {
        await renderer.preloadTextureAsync('./img/textures/star.jpg');
        await renderer.preloadTextureAsync('./img/textures/starnormal.jpg');
        await renderer.preloadTextureAsync('./img/textures/japanese2.jpg');
        await renderer.preloadTextureAsync('./img/textures/japanese3.jpg');
        await renderer.preloadTextureAsync('./img/textures/japanese4.jpg');
        await renderer.preloadTextureAsync('./img/textures/wall1.jpg');
        await renderer.preloadTextureAsync('./img/textures/wall1normal.jpg');
        await renderer.preloadTextureAsync('./img/textures/wall2.jpg');
        await renderer.preloadTextureAsync('./img/textures/wall2normal.jpg');
        await renderer.preloadTextureAsync('./img/textures/water.jpg');
        await renderer.preloadTextureAsync('./img/textures/overgrown_x.jpg');
        await renderer.preloadTextureAsync('./img/textures/stonemixed.jpg');
        await renderer.preloadTextureAsync('./img/textures/stonemixednormal.jpg');
        await renderer.preloadTextureAsync('./img/textures/stonemixed2.jpg');
        await renderer.preloadTextureAsync('./img/textures/stonemixed2normal.jpg');
        await renderer.preloadTextureAsync('./img/textures/cobblestone3.jpg');
        await renderer.preloadTextureAsync('./img/textures/cobblestone3normal.jpg');
        await renderer.preloadTextureAsync('./img/textures/beach.jpg');
        await renderer.preloadTextureAsync('./img/textures/beachnormal.jpg');
        await renderer.preloadTextureAsync('./img/textures/sand.jpg');
        //await pipeline.loadTextureAsync('./img/textures/sandnormal.jpg');
        await renderer.preloadTextureAsync('./img/textures/oop.jpg');
        await renderer.preloadTextureAsync('./img/textures/cobblestone.jpg');
        await renderer.preloadTextureAsync('./img/textures/cobblestone2.jpg');
        await renderer.preloadTextureAsync('./img/textures/basaltcliffs.jpg');
        await renderer.preloadTextureAsync('./img/textures/cliffs.jpg');
        // await pipeline.preloadTextureAsync('./img/textures/overgrown.jpg');
        //await pipeline.loadTextureAsync('./img/textures/bricks.jpg');
    }
    async function boot() {
        const sun = new THREE.DirectionalLight('lavender', Math.PI / 3);
        renderer.scene.add(sun);
        renderer.scene.add(sun.target);
    }
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
            renderer.groups.monolith.add(this.entityGroup);
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
        //update() {
        //	this._update();
        //}
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
        //protected _update() {
        //}
        translate() {
            const { wpos } = this.gobj;
            let pos = this.pos3d = pts.project(wpos, worldetch__.hex_size);
            pos[1] = glob.round_to_nearest(pos[1], worldetch__.pan_compress);
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
                shapeGroundSpecular: 'lavender',
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
                specular: this.data.shapeGroundSpecular,
                shininess: 7,
                normalScale: new THREE.Vector2(1, 1),
                map: renderer.getTexture(this.data.shapeGroundTexture),
                normalMap: renderer.getTexture(this.data.shapeGroundTextureNormal),
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
                map: renderer.getTexture(this.data.shapeTexture),
                normalMap: renderer.getTexture(this.data.shapeTextureNormal)
            });
            if (!tileform.TOGGLE_NORMAL_MAPS)
                material.normalMap = null;
            this.wallGroup = wallMaker(this, material);
            this.wallGroup.position.set(5, 4, 0); // Push it up
            this.wallGroup.updateMatrix();
            this.rotationGroup = new THREE.Group();
            this.rotationGroup.add(this.wallGroup);
            this.rotationGroup.position.z = shapeSize[2] / 2;
            this.entityGroup.add(this.rotationGroup);
            if (tileform.TOGGLE_RENDER_AXES)
                this.entityGroup.add(new THREE.AxesHelper(12));
            this.translate();
            this._step();
            this.wallMaterial = material;
        }
        dispose() {
            //this.wallGroups.geometry.dispose();
            this.wallMaterial.dispose();
        }
        _delete() {
            this.dispose();
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
            const ourPosition = pts.project(gobj.wpos, worldetch__.hex_size);
            const fromPosition = pts.project(fromObject.wpos, worldetch__.hex_size);
            const toPosition = pts.project(toObject.wpos, worldetch__.hex_size);
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
            // Dance the light source
            //return;
            this.light.position.x = 3;
            this.light.updateMatrix();
            const secondsPerRotation = 4;
            this.entityGroup.rotation.z += (Math.PI * 2) * (1 / secondsPerRotation * glob.delta);
            //this.entityGroup.position.x += glob.delta;
            this.entityGroup.updateMatrix();
            this.light.updateMatrix();
        }
        //protected override _update() {
        //}
        _delete() {
            console.log('remove light');
            // super._delete();
        }
        _create() {
            console.log(' tf light source create ');
            this.light = new THREE.PointLight('white', 1, 5);
            // this.light.decay = 2.4;
            this.light.intensity = 700 * (worldetch__.scale * 2);
            this.light.distance = 600 * (worldetch__.scale * 2);
            this.light.decay = 2.3;
            this.light.updateMatrix();
            this.entityGroup.add(this.light);
            // Translate
            this.z = 4;
            this.translate();
            this.entityGroup.updateMatrix();
            // this.entityGroup.updateMatrixWorld(true); // Bad
            renderer.groups.monolith.add(this.entityGroup);
        }
    }
    tileform.light_source = light_source;
    function opkl() {
        if (app.key('f1') == 1) {
            tileform.TOGGLE_TOP_DOWN_MODE = !tileform.TOGGLE_TOP_DOWN_MODE;
            if (tileform.TOGGLE_TOP_DOWN_MODE) {
                worldetch__.camera_rotation = 0;
            }
            else {
                worldetch__.camera_rotation = worldetch__.three_to_one_camera_rotation;
            }
        }
        else if (app.key('f2') == 1) {
            tileform.TOGGLE_RENDER_AXES = !tileform.TOGGLE_RENDER_AXES;
        }
        else if (app.key('f3') == 1) {
            tileform.TOGGLE_NORMAL_MAPS = !tileform.TOGGLE_NORMAL_MAPS;
        }
        else if (app.key('k') == 1) {
            glob.wallrotation -= .01;
        }
        else if (app.key('l') == 1) {
            glob.wallrotation += .01;
        }
        else if (app.key('v') == 1) {
            if (worldetch__.camera_rotation > 0)
                worldetch__.camera_rotation -= .01;
        }
        else if (app.key('b') == 1) {
            worldetch__.camera_rotation += .01;
        }
        else if (app.key('q') == 1) {
            worldetch__.hex_size = pts.add(worldetch__.hex_size, [0, 1]);
        }
        else if (app.key('a') == 1) {
            worldetch__.hex_size = pts.add(worldetch__.hex_size, [0, -1]);
        }
        else if (app.key('1') == 1) {
            worldetch__.hex_size = pts.add(worldetch__.hex_size, [-1, 0]);
        }
        else if (app.key('2') == 1) {
            worldetch__.hex_size = pts.add(worldetch__.hex_size, [1, 0]);
        }
        else {
            return;
        }
        worldetch.purge_remake();
    }
})(tileform || (tileform = {}));
export default tileform;
