var worldetch = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    worldetch: () => worldetch2
  });

  // src/dep/area2.ts
  var area2 = class {
    constructor(base) {
      this.base = base;
      __publicField(this, "points", []);
      this._extract();
    }
    static from_aabb(aabb) {
      return aabb2_default.area(aabb);
    }
    do(func) {
      for (let i = 0; i < this.points.length; i++) {
        func(this.points[i]);
      }
    }
    _extract() {
      this.points = [];
      let x_ = 0;
      for (let y = this.base.min[1]; y < this.base.max[1]; y++) {
        for (let x = this.base.min[0]; x < this.base.max[0]; x++) {
          const isBorder = x === this.base.min[0] || x === this.base.max[0] - 1 || y === this.base.min[1] || y === this.base.max[1] - 1;
          const isUneven = x_++ % 2 === 1;
          const isNorth = y === this.base.min[1];
          const isEast = x === this.base.max[0] - 1;
          const isSouth = y === this.base.max[1] - 1;
          const isWest = x === this.base.min[0];
          this.points.push({ pos: [x, y], isBorder, isNorth, isEast, isSouth, isWest });
        }
      }
    }
  };
  var area2_default = area2;

  // src/dep/glob.ts
  var glob = window["glob"] || {};
  window["glob"] = glob;
  var glob_default = glob;

  // src/dep/pts.ts
  var pts = class _pts {
    static pt(a) {
      return { x: a[0], y: a[1] };
    }
    static vec2s(a) {
      return [String(a[0]), String(a[1])];
    }
    static area_every(aabb, callback) {
      let y = aabb.min[1];
      for (; y <= aabb.max[1]; y++) {
        let x = aabb.max[0];
        for (; x >= aabb.min[0]; x--) {
          callback([x, y]);
        }
      }
    }
    static copy(a) {
      return [a[0], a[1]];
    }
    static make(n, m) {
      return [n, m];
    }
    static to_string(a) {
      const pr = (b) => b != void 0 ? `, ${b}` : "";
      return `${a[0]}, ${a[1]}` + pr(a[2]) + pr(a[3]);
    }
    static to_string_fixed(a) {
      const pr = (b) => b != void 0 ? `, ${b}` : "";
      return `${a[0].toFixed(1)}, ${a[1].toFixed(1)}` + pr(a[2]) + pr(a[3]);
    }
    static func(bb, callback) {
      let y = bb.min[1];
      for (; y <= bb.max[1]; y++) {
        let x = bb.max[0];
        for (; x >= bb.min[0]; x--) {
          callback([x, y]);
        }
      }
    }
    // static readonly hexSize: vec2 = [17, 9];
    static project(w, size = glob_default.hexsize) {
      const tileWidth = size[0] - 1;
      const tileHeight = size[1] - 1;
      const x = w[0];
      const y = -w[1];
      const scaleFactor = tileWidth * 0.75;
      return [
        (x - y) * scaleFactor,
        (x + y) * (-tileHeight / 2)
      ];
    }
    static unproject(r) {
      const tileWidth = glob_default.hexsize[0] - 1;
      const tileHeight = glob_default.hexsize[1] - 1;
      const scaleFactor = tileWidth * 0.75;
      const x = r[0] / scaleFactor;
      const y = -r[1] / (tileHeight / 2);
      const worldX = (x + y) / 2;
      const worldY = (x - y) / 2;
      return [worldX, worldY];
    }
    static equals(a, b) {
      return a[0] == b[0] && a[1] == b[1];
    }
    //static range(a: vec2, b: vec2): boolean {
    //	return true 
    //}
    /*
    static clamp(a: vec2, min: vec2, max: vec2): vec2 {
    	const clamp = (val, min, max) =>
    		val > max ? max : val < min ? min : val;
    	return [clamp(a[0], min[0], max[0]), clamp(a[1], min[1], max[1])];
    }
    */
    static floor(a) {
      return [Math.floor(a[0]), Math.floor(a[1])];
    }
    static ceil(a) {
      return [Math.ceil(a[0]), Math.ceil(a[1])];
    }
    static round(a) {
      return [Math.round(a[0]), Math.round(a[1])];
    }
    static inv(a) {
      return [-a[0], -a[1]];
    }
    static mult(a, n, m) {
      return [a[0] * n, a[1] * (m || n)];
    }
    static mults(a, b) {
      return [a[0] * b[0], a[1] * b[1]];
    }
    static divide(a, n, m) {
      return [a[0] / n, a[1] / (m || n)];
    }
    static divides(a, b) {
      return [a[0] / b[0], a[1] / b[1]];
    }
    static subtract(a, b) {
      return [a[0] - b[0], a[1] - b[1]];
    }
    static add(a, b) {
      return [a[0] + b[0], a[1] + b[1]];
    }
    static addn(a, b) {
      return [a[0] + b, a[1] + b];
    }
    static abs(a) {
      return [Math.abs(a[0]), Math.abs(a[1])];
    }
    static min(a, b) {
      return [Math.min(a[0], b[0]), Math.min(a[1], b[1])];
    }
    static max(a, b) {
      return [Math.max(a[0], b[0]), Math.max(a[1], b[1])];
    }
    static _32(a) {
      return [a[0], a[1]];
    }
    static together(zx) {
      return zx[0] + zx[1];
    }
    static make_uneven(a, n = -1) {
      let b = _pts.copy(a);
      if (b[0] % 2 != 1) {
        b[0] += n;
      }
      if (b[1] % 2 != 1) {
        b[1] += n;
      }
      return b;
    }
    static make_even(a, n = -1) {
      let b = _pts.copy(a);
      if (b[0] % 2 != 0) {
        b[0] += n;
      }
      if (b[1] % 2 != 0) {
        b[1] += n;
      }
      return b;
    }
    static angle(a, b) {
      return -Math.atan2(
        a[0] - b[0],
        a[1] - b[1]
      );
    }
    // https://vorg.github.io/pex/docs/pex-geom/Vec2.html
    static dist(a, b) {
      let dx = b[0] - a[0];
      let dy = b[1] - a[1];
      return Math.sqrt(dx * dx + dy * dy);
    }
    static distsimple(a, b) {
      let c = _pts.abs(_pts.subtract(a, b));
      return Math.max(c[0], c[1]);
    }
  };
  var pts_default = pts;

  // src/dep/aabb2.ts
  var TEST = /* @__PURE__ */ ((TEST2) => {
    TEST2[TEST2["Outside"] = 0] = "Outside";
    TEST2[TEST2["Inside"] = 1] = "Inside";
    TEST2[TEST2["Overlap"] = 2] = "Overlap";
    return TEST2;
  })(TEST || {});
  var _aabb2 = class _aabb2 {
    constructor(a, b) {
      __publicField(this, "min");
      __publicField(this, "max");
      this.min = this.max = [...a];
      if (b) {
        this.extend(b);
      }
    }
    static dupe(aabb) {
      return new _aabb2(aabb.min, aabb.max);
    }
    static area(aabb) {
      return new area2_default(aabb);
    }
    extend(v) {
      this.min = pts_default.min(this.min, v);
      this.max = pts_default.max(this.max, v);
    }
    diagonal() {
      return pts_default.subtract(this.max, this.min);
    }
    center() {
      return pts_default.add(this.min, pts_default.mult(this.diagonal(), 0.5));
    }
    translate(v) {
      this.min = pts_default.add(this.min, v);
      this.max = pts_default.add(this.max, v);
    }
    test(b) {
      if (this.max[0] < b.min[0] || this.min[0] > b.max[0] || this.max[1] < b.min[1] || this.min[1] > b.max[1])
        return 0;
      if (this.min[0] <= b.min[0] && this.max[0] >= b.max[0] && this.min[1] <= b.min[1] && this.max[1] >= b.max[1])
        return 1;
      return 2;
    }
  };
  __publicField(_aabb2, "TEST", TEST);
  var aabb2 = _aabb2;
  var aabb2_default = aabb2;

  // src/dep/hooks.ts
  var hooks = class {
    static create(name) {
      if (!(name in this.hooks)) this.hooks[name] = [];
    }
    static addListener(name, callback) {
      this.create(name);
      this.hooks[name].push(callback);
    }
    static removeListener(name, callback) {
      this.hooks[name] = this.hooks[name].filter((e) => e !== callback);
    }
    static placeListener(name, index, callback) {
      this.create(name);
      if (this.hooks[name][index] !== void 0)
        console.error(`Error: Hook '${name}' already has a function registered at index ${index}`);
      this.hooks[name][index] = callback;
    }
    static async emit(name, x) {
      return this._emitFast(name, x);
    }
    static async _emitFast(name, x) {
      if (!(name in this.hooks)) return;
      for (let i = this.hooks[name].length; i--; )
        if (await this.hooks[name][i]?.(x)) return;
    }
  };
  __publicField(hooks, "hooks", {});
  var hooks_default = hooks;

  // src/core/tileform.ts
  var tileform;
  ((tileform2) => {
    tileform2.TOGGLE_NORMAL_MAPS = true;
    tileform2.TOGGLE_TOP_DOWN_MODE = false;
    tileform2.TOGGLE_RENDER_AXES = false;
    const wallRotation = Math.PI / 6;
    const wallRotationStaggered = Math.PI / 6;
    async function init() {
      await stage.init();
      hooks_default.addListener("worldetchComponents", step2);
      glob_default.wallrotation = wallRotation;
      glob_default.wallrotationstaggered = wallRotationStaggered;
      make_pan_compressor_line();
      return;
    }
    tileform2.init = init;
    function purge() {
      make_pan_compressor_line();
      renderer_default.utilEraseChildren(renderer_default.groups.monolith);
    }
    tileform2.purge = purge;
    let tfCompressor;
    function make_pan_compressor_line() {
      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        0,
        0,
        0,
        0,
        1,
        0
      ]);
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      const material = new THREE.LineBasicMaterial({ color: 16711680 });
      const line = new THREE.Line(geometry, material);
      tfCompressor = line;
    }
    function get_compressor_distance() {
      const screenCoords = getVerticalScreenDifference(
        tfCompressor.geometry,
        tfCompressor,
        renderer_default.camera,
        renderer_default.renderer
      );
      glob_default.pancompress = -1 / screenCoords.y;
    }
    function worldToScreen(vertex, camera, renderer2) {
      const vector = vertex.clone().project(camera);
      const halfWidth = renderer2.domElement.width / 2;
      const halfHeight = renderer2.domElement.height / 2;
      return new THREE.Vector2(
        vector.x * halfWidth + halfWidth,
        -vector.y * halfHeight + halfHeight
        // Flip Y for screen coordinates
      );
    }
    function getVerticalScreenDifference(geometry, object, camera, renderer2) {
      const positions = geometry.attributes.position;
      if (positions.count < 2) {
        console.error("Geometry does not have enough vertices.");
        return null;
      }
      const vertex0 = new THREE.Vector3().fromBufferAttribute(positions, 0).applyMatrix4(object.matrixWorld);
      const vertex1 = new THREE.Vector3().fromBufferAttribute(positions, 1).applyMatrix4(object.matrixWorld);
      const screen0 = worldToScreen(vertex0, camera, renderer2);
      const screen1 = worldToScreen(vertex1, camera, renderer2);
      return new THREE.Vector2().subVectors(screen1, screen0);
    }
    async function step2() {
      renderer_default.scene.scale.set(glob_default.scale, glob_default.scale, glob_default.scale);
      stage.step();
      update_entities();
      get_compressor_distance();
      return false;
    }
    function update_entities() {
      for (const entity of entities) {
        entity.update();
      }
    }
    let stage;
    ((stage2) => {
      function step3() {
        opkl();
      }
      stage2.step = step3;
      async function init2() {
        await preload();
        await boot();
      }
      stage2.init = init2;
      async function preload() {
        await renderer_default.preloadTextureAsync("./img/textures/star.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/starnormal.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/japanese2.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/japanese3.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/japanese4.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/wall1.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/wall1normal.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/wall2.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/wall2normal.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/water.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/overgrown_x.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/stonemixed.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/stonemixednormal.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/stonemixed2.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/stonemixed2normal.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/cobblestone3.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/cobblestone3normal.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/beach.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/beachnormal.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/sand.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/oop.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/cobblestone.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/cobblestone2.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/basaltcliffs.jpg");
        await renderer_default.preloadTextureAsync("./img/textures/cliffs.jpg");
      }
      async function boot() {
        const sun = new THREE.DirectionalLight("lavender", Math.PI / 3);
        renderer_default.scene.add(sun);
        renderer_default.scene.add(sun.target);
      }
    })(stage = tileform2.stage || (tileform2.stage = {}));
    const entities = [];
    class entity3d {
      constructor(gobj) {
        this.gobj = gobj;
        __publicField(this, "entityGroup");
        __publicField(this, "pos3d", [0, 0]);
        __publicField(this, "z", 0);
        this.entityGroup = new THREE.Group();
        entities.push(this);
      }
      _monolithAdd() {
        renderer_default.groups.monolith.add(this.entityGroup);
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
        this.translate();
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
        console.warn("empty entity create");
      }
      _delete() {
        console.warn("empty entity delete");
      }
      _step() {
      }
      _update() {
      }
      translate() {
        const { wpos: wpos2 } = this.gobj;
        let pos = this.pos3d = pts_default.project(wpos2);
        pos[1] = worldetch_default.roundToNearest(pos[1], glob_default.pancompress);
        this.entityGroup.position.fromArray([...pos, this.z]);
        this.entityGroup.updateMatrix();
      }
    }
    class shape3d extends entity3d {
      constructor(data) {
        super(data.gobj);
        this.data = data;
        this.data = {
          shapeTexture: "./img/textures/cobblestone3.jpg",
          shapeTextureNormal: "./img/textures/stonemixednormal.jpg",
          shapeGroundTexture: "./img/textures/stonemixed2.jpg",
          shapeGroundTextureNormal: "./img/textures/stonemixed2normal.jpg",
          shapeGroundSpecular: "lavender",
          ...data
        };
      }
    }
    tileform2.shape3d = shape3d;
    ;
    class shape_hex_wrapper extends shape3d {
      constructor(data) {
        super(data);
        __publicField(this, "hexTile");
      }
      _create() {
        this.hexTile = new hex_tile(this.data);
        this.entityGroup.add(this.hexTile.group);
        if (tileform2.TOGGLE_RENDER_AXES)
          this.entityGroup.add(new THREE.AxesHelper(12));
        this.translate();
      }
      _delete() {
        this.hexTile.free();
      }
    }
    tileform2.shape_hex_wrapper = shape_hex_wrapper;
    tileform2.hexscalar = 7.1;
    class hex_tile {
      constructor(data) {
        this.data = data;
        __publicField(this, "scalar");
        __publicField(this, "group");
        __publicField(this, "mesh");
        this.scalar = tileform2.hexscalar;
        this.make();
      }
      make() {
        const { scalar } = this;
        const vertices = [1 * scalar, 0 * scalar, 0 * scalar, 0.5 * scalar, 0.866 * scalar, 0 * scalar, -0.5 * scalar, 0.866 * scalar, 0 * scalar, -1 * scalar, 0 * scalar, 0 * scalar, -0.5 * scalar, -0.866 * scalar, 0 * scalar, 0.5 * scalar, -0.866 * scalar, 0 * scalar];
        const vertices2 = [1, 0, 0, 0.5, 0.866, 0, -0.5, 0.866, 0, -1, 0, 0, -0.5, -0.866, 0, 0.5, -0.866, 0];
        const indices = [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 1];
        const uvs = [0.5, 0, 1, 0.5, 0.75, 1, 0.25, 1, 0, 0.5, 0.25, 0, 0.75, 0];
        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setIndex(indices);
        const normals = [];
        for (let i = 0; i < indices.length; i += 3) {
          normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
        }
        geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
        const material = new THREE.MeshPhongMaterial({
          color: "white",
          specular: this.data.shapeGroundSpecular,
          shininess: 7,
          normalScale: new THREE.Vector2(1, 1),
          map: renderer_default.getTexture(this.data.shapeGroundTexture),
          normalMap: renderer_default.getTexture(this.data.shapeGroundTextureNormal)
        });
        if (!tileform2.TOGGLE_NORMAL_MAPS)
          material.normalMap = null;
        this.group = new THREE.Group();
        this.group.scale.set(1, 1, 1);
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
        case "nothing":
          console.warn(" no shape type passed to factory ");
          break;
        case "hex":
          shape = new shape_hex_wrapper(data);
          break;
        case "wall":
          shape = new shape_wall(data);
          break;
      }
      return shape;
    }
    tileform2.shapeMaker = shapeMaker;
    class shape_wall extends shape3d {
      constructor(data) {
        super(data);
        __publicField(this, "stagger", false);
        __publicField(this, "rotationGroup");
        __publicField(this, "wallGroup");
        __publicField(this, "wallMaterial");
      }
      _create() {
        const { shapeSize } = this.data;
        const material = new THREE.MeshPhongMaterial({
          // color: 'red',
          map: renderer_default.getTexture(this.data.shapeTexture),
          normalMap: renderer_default.getTexture(this.data.shapeTextureNormal)
        });
        if (!tileform2.TOGGLE_NORMAL_MAPS)
          material.normalMap = null;
        this.wallGroup = wallMaker(this, material);
        this.wallGroup.position.set(5, 4, 0);
        this.wallGroup.updateMatrix();
        this.rotationGroup = new THREE.Group();
        this.rotationGroup.add(this.wallGroup);
        this.rotationGroup.position.z = shapeSize[2] / 2;
        this.entityGroup.add(this.rotationGroup);
        if (tileform2.TOGGLE_RENDER_AXES)
          this.entityGroup.add(new THREE.AxesHelper(12));
        this.translate();
        this._step();
        this.wallMaterial = material;
      }
      dispose() {
        this.wallMaterial.dispose();
      }
      _delete() {
        this.dispose();
      }
      _step() {
        this.rotationGroup.rotation.set(0, 0, glob_default.wallrotation);
        this.rotationGroup.updateMatrix();
        this.entityGroup.updateMatrix();
      }
    }
    tileform2.shape_wall = shape_wall;
    function wallMaker(shape, material) {
      let { shapeSize } = shape.data;
      const size = shapeSize;
      const group = new THREE.Group();
      const gobj = shape.data.gobj;
      const wall3d2 = gobj;
      const adapter = wall3d2.wallAdapter;
      const staggerData = wall3d2.data.extra.staggerData;
      if (!adapter) {
        console.warn(" no direction adapter for wallmaker ");
        return;
      }
      const interpol = (gobj2, to, from) => {
        const fromObjects = adapter.get_all_objects_at(from);
        const toObjects = adapter.get_all_objects_at(to);
        const fromObject = fromObjects[0];
        const toObject = toObjects[0];
        const ourPosition = pts_default.project(gobj2.wpos);
        const fromPosition = pts_default.project(fromObject.wpos);
        const toPosition = pts_default.project(toObject.wpos);
        let midX = (fromPosition[0] + toPosition[0]) / 2 - ourPosition[0];
        let midY = (fromPosition[1] + toPosition[1]) / 2 - ourPosition[1];
        let midPoint = [midX, midY];
        midPoint = pts_default.round(midPoint);
        return midPoint;
      };
      let geometry, mesh;
      if (adapter.tile_occupied("northwest") && adapter.tile_occupied("east")) {
        let point = interpol(wall3d2, "northwest", "east");
        if (staggerData?.isNorth) {
        }
        point = pts_default.add(point, [-3, -4]);
        geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(point[0], point[1], 0);
        mesh.rotation.set(0, 0, Math.PI / 2);
        mesh.updateMatrix();
        group.add(mesh);
      } else if (adapter.tile_occupied("west") && adapter.tile_occupied("southeast")) {
        let point = [0, 0];
        if (staggerData?.isNorth) {
        }
        point = pts_default.add(point, [-4, 0]);
        geometry = new THREE.BoxGeometry(size[0] / 2, size[1], size[2]);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(point[0], point[1], 0);
        mesh.rotation.set(0, 0, Math.PI / 2);
        mesh.updateMatrix();
        group.add(mesh);
      }
      if (adapter.tile_occupied("north")) {
        geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
        mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
      }
      if (adapter.tile_occupied("south")) {
        geometry = new THREE.BoxGeometry(size[0] / 2, size[1], size[2]);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(-size[0] / 4, 0, 0);
        mesh.updateMatrix();
        group.add(mesh);
      }
      if (adapter.tile_occupied("north") && adapter.tile_occupied("east") || adapter.tile_occupied("east") && adapter.tile_occupied("south") || adapter.tile_occupied("south") && adapter.tile_occupied("west") || adapter.tile_occupied("west") && adapter.tile_occupied("north")) {
        geometry = new THREE.BoxGeometry(size[0] / 2, size[1] / 2, size[2]);
        geometry.translate(-size[0] / 4, size[1] / 4, 0);
      }
      return group;
    }
    class shape_light_bad_idea extends shape3d {
      constructor(data) {
        super(data);
        __publicField(this, "light");
      }
      _create() {
      }
    }
    tileform2.shape_light_bad_idea = shape_light_bad_idea;
    class light_source extends entity3d {
      constructor(data) {
        super(data.gobj);
        this.data = data;
        __publicField(this, "wpos2");
        __publicField(this, "light");
        this.data = {
          radiance: 60,
          ...data
        };
        this.wpos2 = pts_default.copy(this.gobj.wpos);
      }
      lyft(pos) {
        this.entityGroup.position.z += 1;
      }
      _step() {
      }
      _update() {
        this.light.position.x = 3;
        this.light.updateMatrix();
        const secondsPerRotation = 4;
        this.entityGroup.rotation.z += Math.PI * 2 * (1 / secondsPerRotation * glob_default.delta);
        this.entityGroup.updateMatrix();
        this.light.updateMatrix();
        glob_default.reprerender = true;
        glob_default.dirtyobjects = true;
      }
      _delete() {
        console.log("remove light");
      }
      _create() {
        console.log(" tf light source create ");
        this.light = new THREE.PointLight("white", 1, 5);
        this.light.intensity = 700 * (glob_default.scale * 2);
        this.light.distance = 600 * (glob_default.scale * 2);
        this.light.decay = 2.3;
        this.light.updateMatrix();
        this.entityGroup.add(this.light);
        this.z = 4;
        this.translate();
        this.entityGroup.updateMatrix();
        renderer_default.groups.monolith.add(this.entityGroup);
        glob_default.reprerender = true;
        glob_default.dirtyobjects = true;
      }
    }
    tileform2.light_source = light_source;
    function opkl() {
      if (app_default.key("f1") == 1) {
        tileform2.TOGGLE_TOP_DOWN_MODE = !tileform2.TOGGLE_TOP_DOWN_MODE;
        if (tileform2.TOGGLE_TOP_DOWN_MODE) {
          glob_default.magiccamerarotation = 0;
        } else {
          glob_default.magiccamerarotation = glob_default.constantmagiccamerarotation;
        }
      } else if (app_default.key("f2") == 1) {
        tileform2.TOGGLE_RENDER_AXES = !tileform2.TOGGLE_RENDER_AXES;
      } else if (app_default.key("f3") == 1) {
        tileform2.TOGGLE_NORMAL_MAPS = !tileform2.TOGGLE_NORMAL_MAPS;
      } else if (app_default.key("k") == 1) {
        glob_default.wallrotation -= 0.01;
      } else if (app_default.key("l") == 1) {
        glob_default.wallrotation += 0.01;
      } else if (app_default.key("v") == 1) {
        if (glob_default.magiccamerarotation > 0)
          glob_default.magiccamerarotation -= 0.01;
      } else if (app_default.key("b") == 1) {
        glob_default.magiccamerarotation += 0.01;
      } else if (app_default.key("q") == 1) {
        glob_default.hexsize = pts_default.add(glob_default.hexsize, [0, 1]);
      } else if (app_default.key("a") == 1) {
        glob_default.hexsize = pts_default.add(glob_default.hexsize, [0, -1]);
      } else if (app_default.key("1") == 1) {
        glob_default.hexsize = pts_default.add(glob_default.hexsize, [-1, 0]);
      } else if (app_default.key("2") == 1) {
        glob_default.hexsize = pts_default.add(glob_default.hexsize, [1, 0]);
      } else {
        return;
      }
      worldetch_default.purgeRemake();
    }
  })(tileform || (tileform = {}));
  var tileform_default = tileform;

  // src/core/objects/game object.ts
  var game_object = class extends loom_default.obj {
    constructor(data) {
      super(glob_default.gobjscount);
      this.data = data;
      // Most game objects represent a single object3d or sprite
      __publicField(this, "object3d");
      __publicField(this, "sprite");
      // Rotation
      __publicField(this, "r", 0);
      // Third axis
      __publicField(this, "z", 0);
      this.data = {
        name: "a game object",
        // _wpos: [0, 0, 0],
        extra: {},
        ...data
      };
      this.wpos = pts_default.copy(data._wpos);
      this.z = data._wpos[2];
      this.r = data._r || 0;
      this._wtorpos();
      this.rpos = pts_default.floor(this.rpos);
    }
    update() {
      this.sprite?.update();
    }
    _create() {
      console.warn(" game object empty create ");
    }
    _delete() {
      this.sprite?.delete();
      this.object3d?.delete();
    }
    _step() {
      super._step();
      this.sprite?.step();
      this.object3d?.step();
    }
  };
  ((game_object2) => {
    let helpers;
    ((helpers2) => {
      function get_matrix(world, wpos2) {
        return loom_default.helpers.getMatrix(world, wpos2);
      }
      helpers2.get_matrix = get_matrix;
      function sort_matrix(world, wpos2, types) {
        return get_matrix(world, wpos2).map((column) => column.filter((obj) => types.includes(obj.data._type)));
      }
      helpers2.sort_matrix = sort_matrix;
      function get_directions(matrix) {
        const directions = [
          "northwest",
          "north",
          "northeast",
          "west",
          "center",
          "east",
          "southwest",
          "south",
          "southeast"
        ];
        return directions.map((dir, index) => matrix[index].length > 0 ? dir : null);
      }
      helpers2.get_directions = get_directions;
    })(helpers = game_object2.helpers || (game_object2.helpers = {}));
  })(game_object || (game_object = {}));
  var game_object_default = game_object;

  // src/core/components/zoom.ts
  var zoom;
  ((zoom2) => {
    zoom2.level = 3;
    const wheelEnabled = false;
    zoom2.zooms = [1, 0.5, 0.33, 0.2, 0.1, 0.05];
    function register() {
      hooks_default.addListener("worldetchComponents", step2);
    }
    zoom2.register = register;
    function scale() {
      return zoom2.zooms[zoom2.level];
    }
    zoom2.scale = scale;
    async function step2() {
      if (wheelEnabled && app_default.wheel == -1 || app_default.key("f") == 1) {
        console.log("app wheel");
        zoom2.level = zoom2.level > 0 ? zoom2.level - 1 : zoom2.level;
        glob_default.dirtyobjects = true;
      }
      if (wheelEnabled && app_default.wheel == 1 || app_default.key("r") == 1) {
        console.log("app wheel");
        zoom2.level = zoom2.level < zoom2.zooms.length - 1 ? zoom2.level + 1 : zoom2.level;
        glob_default.dirtyobjects = true;
      }
      const camera = renderer_default.USE_SCENE3 ? renderer_default.camera3 : renderer_default.camera;
      const scale2 = zoom2.zooms[zoom2.level];
      if (renderer_default.cameraMode == "perspective") {
        renderer_default.camera.position.z = (5 - zoom2.level) * 40 || 10;
      } else {
        camera.scale.set(scale2, scale2, scale2);
      }
      camera.updateMatrix();
      camera.updateProjectionMatrix();
      return false;
    }
  })(zoom || (zoom = {}));
  var zoom_default = zoom;

  // src/core/sprite.ts
  var sprite = class {
    constructor(data) {
      this.data = data;
      __publicField(this, "gobj");
      __publicField(this, "matrix");
      __publicField(this, "mesh");
      __publicField(this, "geometry");
      __publicField(this, "material");
      this.data = {
        spriteSize: glob_default.hexsize,
        spriteImage: "hex/tile.png",
        spriteColor: "white",
        ...data
      };
      this.data.spriteSize = pts_default.make_uneven(this.data.spriteSize, 1);
      this.gobj = this.data.gobj;
      this.gobj.sprite = this;
      if (glob_default.randomspritecolor)
        this.data.spriteColor = glob_default.sample(["purple", "magenta", "cyan", "wheat", "pink", "salmon"]);
      this.matrix = new THREE.Matrix3();
      this.matrix.setUvTransform(0, 0, 1, 1, 0, 0, 1);
    }
    create() {
      this._create();
    }
    delete() {
      this._delete();
    }
    step() {
      this._step();
    }
    _step() {
    }
    _delete() {
      return;
      this.mesh.parent.remove(this.mesh);
      this.gobj.sprite = void 0;
    }
    _create() {
      let defines = {};
      return;
      this.material = SpriteMaterial({
        map: renderer_default.getTexture("./img/" + this.data.spriteImage),
        color: this.data.spriteColor,
        transparent: true,
        depthTest: false
        // side: THREE.DoubleSide
      }, {
        matrix: this.matrix,
        maskColor: new THREE.Vector3(1, 1, 1),
        masked: false,
        bool: true
      }, defines);
      let { spriteSize } = this.data;
      spriteSize = pts_default.mult(spriteSize, glob_default.scale);
      this.geometry = new THREE.PlaneGeometry(spriteSize[0], spriteSize[1], 1, 1);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.update();
      renderer_default.groups.sprites.add(this.mesh);
    }
    update() {
      return;
      const { gobj: gabe } = this;
      this.material.color.set(this.data.spriteColor);
      this.mesh.renderOrder = -gabe.wpos[1] + gabe.wpos[0];
      let pos = pts_default.copy(gabe.rpos);
      const tileSize = glob_default.hexsize;
      if (this.data.bottomSort)
        pos[1] += this.data.spriteSize[1] / 2;
      this.mesh.position.fromArray([...pos, gabe.z]);
      this.mesh.updateMatrix();
    }
  };
  function SpriteMaterial(parameters, uniforms, defines = {}) {
    let material = new THREE.MeshLambertMaterial(parameters);
    material.customProgramCacheKey = function() {
      return "romespritemat";
    };
    material.name = "romespritemat";
    material.defines = defines;
    material.onBeforeCompile = function(shader) {
      shader.uniforms.matrix = { value: uniforms.matrix };
      shader.uniforms.bool = { value: uniforms.bool };
      if (uniforms.masked) {
        shader.uniforms.tMask = { value: renderer_default.targetMask.texture };
        shader.uniforms.maskColor = { value: uniforms.maskColor };
        console.log("add tmask");
      }
      shader.vertexShader = shader.vertexShader.replace(
        `#include <common>`,
        `#include <common>
			varying vec2 myPosition;
			uniform mat3 matrix;
			`
      );
      shader.vertexShader = shader.vertexShader.replace(
        `#include <worldpos_vertex>`,
        `#include <worldpos_vertex>
			myPosition = (projectionMatrix * mvPosition).xy / 2.0 + vec2(0.5, 0.5);
			`
      );
      shader.vertexShader = shader.vertexShader.replace(
        `#include <uv_vertex>`,
        `
			#ifdef USE_MAP
				vMapUv = ( matrix * vec3( uv, 1 ) ).xy;
			#endif
			`
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <map_pars_fragment>`,
        `
			#include <map_pars_fragment>
			/*varying vec2 myPosition;
			uniform sampler2D tMask;
			uniform vec3 maskColor;
			uniform bool uniball;*/
			`
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <map_fragment>`,
        `
			#include <map_fragment>

			/*#ifdef MASKEDx
				vec4 texelColor = texture2D( tMask, myPosition );
				texelColor.rgb = mix(texelColor.rgb, maskColor, 0.7);
				if (texelColor.a > 0.5)
				diffuseColor.rgb = texelColor.rgb;
			#endif*/
			`
      );
    };
    return material;
  }
  var sprite_default = sprite;

  // src/core/objects/tile.ts
  var tile = class extends game_object_default {
    constructor(data) {
      super({
        name: "a tile",
        ...data
      });
      this.wpos = pts_default.floor(this.wpos);
      this.data._type = "tile";
    }
    _create() {
      new sprite_default({
        gobj: this,
        spriteSize: glob_default.hexsize
      });
      this.sprite?.create();
    }
    /*protected override _delete() {
    	console.log('delete');
    }*/
  };
  var tile_default = tile;

  // src/core/components/pan.ts
  var wpos = [0, 0];
  var rpos = [0, 0];
  var begin = [0, 0];
  var before = [0, 0];
  var panPerspectiveWarp = [1, 2];
  var _pan = class _pan {
    static register() {
      hooks_default.addListener("worldetchComponents", this.step);
      this.startup();
    }
    static async step() {
      _pan.do_the_math();
      return false;
    }
    static get wpos() {
      return pts_default.copy(wpos);
    }
    static set wpos(w) {
      wpos = w;
      rpos = loom_default.project(wpos);
    }
    static get rpos() {
      return pts_default.copy(rpos);
    }
    static set rpos(r) {
      rpos = r;
      wpos = loom_default.unproject(rpos);
    }
    static startup() {
      this.wpos = [10, 1];
      this.marker = new tile_default({
        _wpos: [...wpos, 0],
        colorOverride: "purple",
        lonely: true
      });
      this.marker.show();
      window["panMarker"] = this.marker;
    }
    static do_the_math() {
      this.follow();
      this.pan();
      this.arrows();
      wpos = loom_default.unproject(rpos);
      if (this.roundRpos)
        rpos = pts_default.floor(rpos);
      this.marker.wpos = wpos;
      if (this.noHalfMeasures)
        this.marker.wpos = pts_default.round(this.marker.wpos);
      this.marker._wtorpos();
      this.marker.update();
      this.set_camera();
    }
    static follow() {
      if (this.follower) {
        let wpos2 = this.follower.wpos;
        wpos2 = pts_default.add(wpos2, [0.5, 0.5]);
        rpos = loom_default.project(wpos2);
      }
    }
    static arrows() {
      if (app_default.key("arrowright")) {
        rpos[0] += 1 * glob_default.scale;
        glob_default.dirtyobjects = true;
      }
      if (app_default.key("arrowleft")) {
        rpos[0] -= 1 * glob_default.scale;
        glob_default.dirtyobjects = true;
      }
      if (app_default.key("arrowup")) {
        rpos[1] += 1 * glob_default.scale;
        glob_default.dirtyobjects = true;
      }
      if (app_default.key("arrowdown")) {
        rpos[1] -= 1 * glob_default.scale;
        glob_default.dirtyobjects = true;
      }
    }
    static pan() {
      const continuousMode = false;
      const continuousSpeed = -100;
      const panDirection = -1;
      if (app_default.button(1) == 1) {
        let mouse = app_default.mouse();
        mouse[1] = -mouse[1];
        begin = mouse;
        before = pts_default.copy(rpos);
        this.dragging = true;
      }
      if (this.dragging == false)
        return;
      if (app_default.button(1) >= 1) {
        glob_default.dirtyobjects = true;
        let mouse = app_default.mouse();
        mouse[1] = -mouse[1];
        let dif = pts_default.subtract(begin, mouse);
        if (continuousMode) {
          dif = pts_default.divide(dif, continuousSpeed);
          rpos = pts_default.add(rpos, dif);
        } else {
          dif = pts_default.divide(dif, panDirection);
          dif = pts_default.mult(dif, glob_default.dotsPerInch);
          dif = pts_default.mult(dif, zoom_default.scale());
          dif = pts_default.mult(dif, panPerspectiveWarp[0], panPerspectiveWarp[1]);
          if (renderer_default.USE_SCENE3)
            dif = pts_default.divide(dif, 2);
          dif = pts_default.subtract(dif, before);
          rpos = pts_default.inv(dif);
        }
      } else if (app_default.button(1) == -1) {
        console.log("release");
        if (this.dragReleaseRoundsToNearestFullPixel)
          rpos = pts_default.round(rpos);
        this.dragging = false;
      }
    }
    static set_camera() {
      let rpos2 = _pan.rpos;
      rpos2 = pts_default.make_even(rpos2, 1);
      rpos2[1] = worldetch_default.roundToNearest(rpos2[1], glob_default.pancompress * 2);
      renderer_default.groups.camera.position.x = rpos2[0];
      renderer_default.groups.camera.position.y = rpos2[1];
      renderer_default.groups.camera.position.z = 10;
      renderer_default.groups.camera.updateMatrix();
      renderer_default.camera.rotation.x = glob_default.magiccamerarotation;
      renderer_default.camera.updateMatrix();
      renderer_default.camera.updateProjectionMatrix();
    }
    static unproject_chunk_grid(rpos2) {
      let point = [0, 0];
      const chunks = loom_default.helpers.getEveryChunk(world_manager_default.world);
      for (const chunk of chunks) {
      }
    }
  };
  __publicField(_pan, "panCompress", 2);
  __publicField(_pan, "marker");
  __publicField(_pan, "follower");
  // Make the marker move in full tiles?
  __publicField(_pan, "noHalfMeasures", false);
  // Rpos be pixel-based?
  __publicField(_pan, "roundRpos", true);
  // Punish the player after dragging the camera?
  __publicField(_pan, "dragReleaseRoundsToNearestFullPixel", false);
  __publicField(_pan, "dragging", false);
  var pan = _pan;
  var pan_default = pan;

  // src/core/world manager.ts
  var WorldManager = class {
    static init() {
      this.world = glob_default.world = loom_default.init();
    }
    static update() {
      this.world.update(pan_default.wpos);
    }
    static repopulate() {
    }
    static getObjectsAt(target) {
      const { wpos: pos } = target;
      return this.world.chunkAtWpos(pos).objsatwpos(pos);
    }
    static addGameObject(gobj) {
      loom_default.add(this.world, gobj);
    }
    static removeGameObject(gobj) {
      loom_default.remove(gobj);
    }
    static _replace(target) {
      const objects = this.getObjectsAt(target);
      for (const gobj of objects) {
        loom_default.remove(gobj);
      }
      loom_default.addDontYetShow(this.world, target);
    }
    static addMultiple(gobjs, mode) {
      for (let gobj of gobjs) {
        if (mode === this.merge_mode.merge)
          this._merge(gobj);
        else if (mode === this.merge_mode.replace)
          this._replace(gobj);
        else if (mode === this.merge_mode.dont)
          loom_default.addDontYetShow(this.world, gobj);
      }
      for (let gobj of gobjs) {
        if (gobj.chunk?.active)
          gobj.show();
      }
    }
    // These are the most normal mergers,
    // like when you put a wall on a tile,
    // or a tile on a wall
    static _merge(target) {
      let objects = this.getObjectsAt(target);
      let addTarget = true;
      for (let present of objects) {
        if (present.data._type == "tile 3d" && target.data._type == "tile 3d") {
          addTarget = false;
          present.preset = target.preset;
        }
      }
      if (addTarget) {
        loom_default.addDontYetShow(this.world, target);
      }
    }
  };
  __publicField(WorldManager, "world");
  ((WorldManager2) => {
    let merge_mode;
    ((merge_mode2) => {
      merge_mode2[merge_mode2["dont"] = 0] = "dont";
      merge_mode2[merge_mode2["merge"] = 1] = "merge";
      merge_mode2[merge_mode2["replace"] = 2] = "replace";
    })(merge_mode = WorldManager2.merge_mode || (WorldManager2.merge_mode = {}));
  })(WorldManager || (WorldManager = {}));
  var world_manager_default = WorldManager;

  // src/core/staggered area.ts
  var staggered_area = class extends area2_default {
    constructor(area) {
      super(area.base);
      __publicField(this, "points", []);
      this._stagger();
    }
    // do(func: (pos: point) => void) 
    _stagger() {
      this.points = [];
      let i = 0;
      let y_ = 0;
      for (let y = this.base.min[1]; y < this.base.max[1]; y++) {
        let x_ = 0;
        let shift = 0;
        const isYUneven = y_++ % 2 === 1;
        for (let x = this.base.min[0]; x < this.base.max[0]; x++) {
          const isBorder = x === this.base.min[0] || x === this.base.max[0] - 1 || y === this.base.min[1] || y === this.base.max[1] - 1;
          const isXUneven = x_++ % 2 === 1;
          const isStaggered = isXUneven;
          const isSouth = y === this.base.min[1];
          const isWest = x === this.base.max[0] - 1;
          const isNorth = y === this.base.max[1] - 1;
          const isEast = x === this.base.min[0];
          if (isXUneven) {
            shift += 1;
          }
          this.points.push({ pos: [x, y - shift], isBorder, isStaggered, isXUneven, isYUneven, isNorth, isEast, isSouth, isWest });
        }
      }
    }
    _tell_size() {
    }
  };
  var staggered_area_default = staggered_area;

  // src/core/direction adapter.ts
  var direction_adapter = class {
    constructor(gobj) {
      this.gobj = gobj;
      __publicField(this, "target");
      __publicField(this, "shape3d");
      __publicField(this, "matrix", [[]]);
      __publicField(this, "directions", []);
    }
    search(types) {
      this.matrix = game_object_default.helpers.sort_matrix(world_manager_default.world, this.gobj.wpos, types);
      this.directions = game_object_default.helpers.get_directions(this.matrix);
    }
    get_all_objects_at(direction) {
      const i = this.directions.indexOf(direction);
      if (i !== -1) {
        return this.matrix[i];
      }
    }
    tile_occupied(direction) {
      return this.directions.includes(direction);
    }
    has_matrix(direction) {
      return this.directions.includes(direction);
    }
    index_of_direction(direction) {
      return this.directions.indexOf(direction);
    }
  };
  var direction_adapter_default = direction_adapter;

  // src/core/objects/wall 3d.ts
  var wall3d = class extends game_object_default {
    constructor(data, preset = "default") {
      super({
        name: "a wall 3d",
        ...data
      });
      this.preset = preset;
      __publicField(this, "wallAdapter");
      this.data._type = "wall 3d";
      this.wallAdapter = new direction_adapter_default(this);
    }
    _create() {
      new object_3d_default({
        gobj: this,
        shapeSize: [16, 8, 11],
        shapeType: "wall",
        shapePreset: this.preset
      });
      this.wallAdapter.search(["wall 3d"]);
      this.object3d?.create();
    }
  };
  var wall_3d_default = wall3d;

  // src/eye/land.ts
  var land;
  ((land2) => {
    function init() {
    }
    land2.init = init;
    class perlin_area {
      // perlin does not repeat but is repeatable
      constructor(seed, scale) {
        this.scale = scale;
        this._set(seed);
      }
      _set(seed) {
        noise.seed(seed);
      }
      get_simplex2(x, y) {
        const point = noise.simplex2(x / this.scale[0], y / this.scale[1]);
        return point;
      }
    }
    function repopulate() {
      make();
      make_staggered_building();
      make_non_staggered_lake();
    }
    land2.repopulate = repopulate;
    function make() {
      noise.seed(28);
      const objects = [];
      const populate = [100, 100];
      const area = new perlin_area(28, [10, 10]);
      for (let y = 0; y < populate[0]; y++) {
        for (let x = 0; x < populate[1]; x++) {
          const point = area.get_simplex2(x, y);
          let tilePreset = "default";
          if (point < 0) {
            if (point < -0.6) {
              tilePreset = "cobblestone";
            } else if (point < -0.3) {
              tilePreset = "stonemixed";
            }
            const tile2 = new tile_3d_default({
              _type: "direct",
              _wpos: [-populate[0] / 2 + x, -populate[1] / 2 + y, 0]
            }, tilePreset);
            objects.push(tile2);
          }
        }
      }
      world_manager_default.addMultiple(objects, world_manager_default.merge_mode.merge);
    }
    function make_staggered_building() {
      const objects = [];
      const pos = [8, 0];
      const size = [5, 5];
      const aabb = new aabb2_default(pos, pts_default.add(pos, size));
      const staggeredArea = new staggered_area_default(aabb2_default.area(aabb));
      staggeredArea.do((point) => {
        if (point.isBorder) {
          const wall2 = new wall_3d_default({
            _type: "direct",
            _wpos: [point.pos[0], point.pos[1], 0],
            extra: { staggerData: point }
            // colorOverride: 'green'
          }, "elven");
          const tile2 = new tile_3d_default({
            _type: "direct",
            _wpos: [point.pos[0], point.pos[1], 0]
          }, "star");
          objects.push(wall2);
          objects.push(tile2);
        } else {
          const tile2 = new tile_3d_default({
            _type: "direct",
            _wpos: [point.pos[0], point.pos[1], 0]
          }, "star");
          objects.push(tile2);
        }
      });
      world_manager_default.addMultiple(objects, world_manager_default.merge_mode.merge);
    }
    function make_non_staggered_lake() {
      const objects = [];
      const pos = [8, 8];
      const size = [5, 5];
      const aabb = new aabb2_default(pos, pts_default.add(pos, size));
      const area = aabb2_default.area(aabb);
      area.do((point) => {
        if (point.isBorder) {
          const wall2 = new wall_3d_default({
            _type: "direct",
            _wpos: [point.pos[0], point.pos[1], 0]
            // colorOverride: 'green'
          }, "basalt");
          objects.push(wall2);
        } else {
          const tile2 = new tile_3d_default({
            _type: "direct",
            _wpos: [point.pos[0], point.pos[1], 0]
          }, "water");
          objects.push(tile2);
        }
      });
      world_manager_default.addMultiple(objects, world_manager_default.merge_mode.merge);
    }
    function test_fill() {
      const gobjs = [];
      const baseWidth = 100;
      const baseHeight = 100;
      const width = 10;
      const height = 10;
      for (let y = 0; y < baseWidth; y++) {
        for (let x = 0; x < baseHeight; x++) {
          let tilePreset = "default";
          const tile2 = new tile_3d_default({
            _type: "direct",
            _wpos: [-baseWidth / 2 + x, -baseHeight / 2 + y, 0]
          }, tilePreset);
          gobjs.push(tile2);
        }
      }
      world_manager_default.addMultiple(gobjs, world_manager_default.merge_mode.replace);
    }
    land2.test_fill = test_fill;
    function make_bodies_of_water() {
      noise.seed(29);
    }
    land2.make_bodies_of_water = make_bodies_of_water;
  })(land || (land = {}));
  var land_default = land;

  // src/eye/game.ts
  var game;
  ((game2) => {
    game2.groundPresets = {
      default: {
        shapeGroundTexture: "./img/textures/beach.jpg",
        shapeGroundTextureNormal: "./img/textures/beachnormal.jpg"
      },
      stonemixed: {
        shapeGroundTexture: "./img/textures/stonemixed2.jpg",
        shapeGroundTextureNormal: "./img/textures/stonemixed2normal.jpg"
      },
      cobblestone: {
        shapeGroundTexture: "./img/textures/cobblestone3.jpg",
        shapeGroundTextureNormal: "./img/textures/cobblestone3normal.jpg"
      },
      water: {
        shapeGroundTexture: "./img/textures/water.jpg",
        shapeGroundTextureNormal: "./img/textures/beachnormal.jpg"
      },
      star: {
        shapeGroundTexture: "./img/textures/star.jpg",
        shapeGroundTextureNormal: "./img/textures/starnormal.jpg",
        shapeGroundSpecular: "cyan"
      }
    };
    game2.shapePresets = {
      default: {
        shapeTexture: "./img/textures/wall2.jpg",
        shapeTextureNormal: "./img/textures/wall2normal.jpg"
      },
      elven: {
        shapeTexture: "./img/textures/japanese3.jpg",
        shapeTextureNormal: "./img/textures/cobblestone2normal.jpg"
      },
      basalt: {
        shapeTexture: "./img/textures/basaltcliffs.jpg",
        shapeTextureNormal: "./img/textures/basalt.jpg"
      }
    };
    function init() {
      land_default.init();
      repopulate();
    }
    game2.init = init;
    function update() {
    }
    game2.update = update;
    function repopulate() {
      land_default.repopulate();
    }
    game2.repopulate = repopulate;
  })(game || (game = {}));
  var game_default = game;

  // src/core/object 3d.ts
  var object3d = class {
    constructor(data) {
      this.data = data;
      __publicField(this, "gobj");
      __publicField(this, "shape");
      __publicField(this, "data_");
      let groundData = game_default.groundPresets[data.groundPreset];
      let shapeData = game_default.shapePresets[data.shapePreset];
      this.data = {
        ...data,
        ...groundData,
        ...shapeData
      };
      this.gobj = this.data.gobj;
      this.gobj.object3d = this;
    }
    delete() {
      this.shape?.delete();
    }
    create() {
      this.shape = tileform_default.shapeMaker(
        this.data.shapeType,
        this.data
      );
      this.shape?.create();
    }
    step() {
      this.shape?.step();
    }
  };
  var object_3d_default = object3d;

  // src/core/objects/tile 3d.ts
  var tile3d = class extends game_object_default {
    constructor(data, preset = "default") {
      super({
        name: "a tile 3d",
        ...data
      });
      this.preset = preset;
      this.data._type = "tile 3d";
    }
    _create() {
      new object_3d_default({
        gobj: this,
        shapeSize: [1, 1, 1],
        shapeType: "hex",
        groundPreset: this.preset
      });
      this.object3d?.create();
    }
  };
  var tile_3d_default = tile3d;

  // src/core/components/debug screen.ts
  var debug_screen = class {
    static register() {
      hooks_default.addListener("worldetchComponents", this.step);
      this.startup();
    }
    static async step() {
      step();
      return false;
    }
    static startup() {
    }
  };
  function step() {
    document.querySelector("worldetch-stats").innerHTML = `
		worldetch - monolith git branch (debug screen)
		<br />DOTS_PER_INCH_CORRECTED_RENDER_TARGET: ${renderer_default.DOTS_PER_INCH_CORRECTED_RENDER_TARGET}
		<br />ROUND_UP_DOTS_PER_INCH: ${renderer_default.ROUND_UP_DOTS_PER_INCH}
		<br />USE_SCENE3: ${renderer_default.USE_SCENE3}
		<br />DITHERING (d): ${renderer_default.dithering}
		<br />--
		<br />TOGGLE_TOP_DOWN_MODE (f1): ${tileform_default.TOGGLE_TOP_DOWN_MODE}
		<br />TOGGLE_RENDER_AXES (f2): ${tileform_default.TOGGLE_RENDER_AXES}
		<br />TOGGLE_NORMAL_MAPS (f3): ${tileform_default.TOGGLE_NORMAL_MAPS}
		<br />--
		<br />"globs"
		<br />&#9;randomspritecolor (h): ${glob_default.randomspritecolor}
		<br />magiccamerarotation (v, b): ${glob_default.magiccamerarotation}
		<br />wallrotation (v, b): ${glob_default.wallrotation}
		<br />pancompress (v, b): ${glob_default.pancompress}
		<br />--
		<br />camera rotation x (v, b): ${glob_default.magiccamerarotation}
		<br />color correction (z): ${renderer_default.compression}
		<br />render scale (-, =): ${glob_default.scale}
		<br />zoom scale (r, f): ${zoom_default.scale()}
		<br />grid (t, g): ${world_manager_default.world.grid.spread} / ${world_manager_default.world.grid.outside}
		<br />hexscalar ([, ]): ${tileform_default.hexscalar}
		<br />--
		<br />fps: ${glob_default.fps?.toFixed(2)} ${glob_default.delta?.toFixed(3)}
		<br />reprerender: ${glob_default.reprerender}
		<br />dirtyObjects: ${glob_default.dirtyobjects}
		<br />hex size (q, a): ${pts_default.to_string_fixed(glob_default.hexsize)}
		<!--<br />cameraMode: ${renderer_default.cameraMode}-->
		<br />chunk span size: ${loom_default.chunk_span} x ${loom_default.chunk_span}
		<br />gobjs: ${glob_default.gobjscount[0]} / ${glob_default.gobjscount[1]}
		<br />chunks: ${loom_default.numbers.chunks[0]} / ${loom_default.numbers.chunks[1]}
		<br />pan wpos, rpos: ${pts_default.to_string_fixed(pan_default.wpos)} (${pts_default.to_string_fixed(pan_default.rpos)})
		`;
  }
  var debug_screen_default = debug_screen;

  // src/eye/romanlike.ts
  var romanlike;
  ((romanlike2) => {
    function init() {
      console.log(" game/romanlike ");
    }
    romanlike2.init = init;
    function register() {
      console.log(" game/romanlike ");
    }
    romanlike2.register = register;
  })(romanlike || (romanlike = {}));
  var romanlike_default = romanlike;

  // src/core/objects/light.ts
  var light = class extends game_object_default {
    constructor(data) {
      super({
        name: "a light",
        ...data
      });
      __publicField(this, "light_source");
      this.data._type = "light";
    }
    _create() {
      console.log(" create light ");
      this.light_source = new tileform_default.light_source({
        gobj: this,
        radiance: 200
      });
      this.light_source.create();
      new sprite_default({
        gobj: this,
        spriteImage: "hex/post.png",
        spriteSize: [glob_default.hexsize[0], 30],
        bottomSort: true
      });
      this.sprite?.create();
    }
    _delete() {
      super._delete();
      this.light_source?.delete();
    }
    _step() {
      super._step();
      this.light_source.step();
    }
  };
  var light_default = light;

  // src/worldetch.ts
  var worldetch;
  ((worldetch3) => {
    function sample(a) {
      return a[Math.floor(Math.random() * a.length)];
    }
    worldetch3.sample = sample;
    function clamp(val, min, max) {
      return val > max ? max : val < min ? min : val;
    }
    worldetch3.clamp = clamp;
    function roundToNearest(value, nearest) {
      return Math.round(value / nearest) * nearest;
    }
    worldetch3.roundToNearest = roundToNearest;
    async function init() {
      console.log(" init ");
      glob_default.rome = worldetch3;
      glob_default.reprerender = true;
      glob_default.dirtyobjects = true;
      glob_default.randomspritecolor = false;
      glob_default.scale = 1;
      glob_default.constantmagiccamerarotation = 0.962;
      glob_default.magiccamerarotation = glob_default.constantmagiccamerarotation;
      glob_default.hexsize = [17, 9];
      glob_default.hexsize = [17, 15];
      glob_default.pancompress = 2;
      glob_default.camerarpos = [0, 0];
      glob_default.gobjscount = [0, 0];
      glob_default.sample = worldetch3.sample;
      await preload_basic_textures();
      await renderer_default.init();
      await tileform_default.init();
      romanlike_default.init();
      world_manager_default.init();
      game_default.init();
      app_default;
      makeTestingChamber();
      debug_screen_default.register();
      zoom_default.register();
      pan_default.register();
    }
    worldetch3.init = init;
    async function preload_basic_textures() {
      await renderer_default.preloadTextureAsync("./img/hex/tile.png", "nearest");
      await renderer_default.preloadTextureAsync("./img/hex/wall.png", "nearest");
      await renderer_default.preloadTextureAsync("./img/hex/post.png", "nearest");
    }
    function makeTestingChamber() {
      let gobjs = [];
      const collect = (gobj) => gobjs.push(gobj);
      collect(new tile_3d_default({ colorOverride: "pink", _wpos: [-1, 0, 0] }, "cobblestone"));
      collect(new tile_3d_default({ colorOverride: "salmon", _wpos: [-1, -1, 0] }));
      collect(new tile_3d_default({ colorOverride: "cyan", _wpos: [0, -1, 0] }));
      collect(new tile_3d_default({ colorOverride: "yellow", _wpos: [-1, 1, 0] }));
      collect(new tile_3d_default({ colorOverride: "yellow", _wpos: [0, 1, 0] }));
      collect(new tile_3d_default({ colorOverride: "salmon", _wpos: [0, 2, 0] }));
      collect(new tile_3d_default({ colorOverride: "yellow", _wpos: [0, 3, 0] }));
      collect(new tile_3d_default({ colorOverride: "orange", _wpos: [0, 4, 0] }));
      collect(new tile_3d_default({ colorOverride: "red", _wpos: [0, 5, 0] }));
      collect(new tile_3d_default({ colorOverride: "blue", _wpos: [0, 6, 0] }));
      collect(new tile_3d_default({ colorOverride: "wheat", _wpos: [0, 7, 0] }));
      collect(new tile_3d_default({ colorOverride: "lavender", _wpos: [0, 8, 0] }));
      collect(new tile_3d_default({ colorOverride: "cyan", _wpos: [0, 9, 0] }));
      collect(new wall_3d_default({ colorOverride: "green", _wpos: [2, 1, 0] }));
      collect(new wall_3d_default({ colorOverride: "lavender", _wpos: [2, 3, 0] }));
      collect(new wall_3d_default({ colorOverride: "magenta", _wpos: [3, 1, 0] }));
      collect(new wall_3d_default({ colorOverride: "pink", _wpos: [3, 2, 0] }));
      collect(new wall_3d_default({ colorOverride: "blue", _wpos: [3, 3, 0] }));
      collect(new wall_3d_default({ colorOverride: "red", _wpos: [4, 3, 0] }));
      collect(new wall_3d_default({ colorOverride: "purple", _wpos: [5, 3, 0] }));
      collect(new light_default({ _wpos: [2, 2, 0] }));
      collect(new light_default({ _wpos: [-11, 6, 0] }));
      collect(new light_default({ _wpos: [9, 2, 0] }));
      collect(new wall_3d_default({ colorOverride: "magenta", _wpos: [1, 2, 0] }));
      collect(new wall_3d_default({ colorOverride: "pink", _wpos: [1, 3, 0] }));
      collect(new wall_3d_default({ colorOverride: "blue", _wpos: [1, 4, 0] }));
      collect(new wall_3d_default({ colorOverride: "red", _wpos: [1, 5, 0] }));
      collect(new wall_3d_default({ colorOverride: "purple", _wpos: [1, 6, 0] }));
      collect(new wall_3d_default({ colorOverride: "purple", _wpos: [1, 7, 0] }));
      collect(new wall_3d_default({ colorOverride: "purple", _wpos: [1, 8, 0] }));
      world_manager_default.addMultiple(gobjs, world_manager_default.merge_mode.merge);
    }
    worldetch3.makeTestingChamber = makeTestingChamber;
    function purgeRemake() {
      console.warn(" purgeRemake ");
      const chunks = loom_default.helpers.getEveryChunk(world_manager_default.world);
      for (const chunk of chunks) {
        chunk.nuke();
      }
      glob_default.reprerender = true;
      glob_default.dirtyobjects = true;
      tileform_default.purge();
      renderer_default.purge();
      world_manager_default.init();
      world_manager_default.repopulate();
      game_default.repopulate();
      makeTestingChamber();
    }
    worldetch3.purgeRemake = purgeRemake;
    function step2() {
      hooks_default.emit("worldetchComponents", 1);
      hooks_default.emit("worldetchStep", 0);
      keys();
      world_manager_default.update();
      game_default.update();
      glob_default.reprerender = false;
    }
    worldetch3.step = step2;
    function keys() {
      if (app_default.key("h") == 1) {
        glob_default.randomspritecolor = !glob_default.randomspritecolor;
        purgeRemake();
      }
      if (app_default.key("-") == 1) {
        if (glob_default.scale > 1)
          glob_default.scale -= 1;
        pan_default.rpos = pts_default.mult(pts_default.project(pan_default.wpos), glob_default.scale);
        console.log(glob_default.scale);
        purgeRemake();
      }
      if (app_default.key("=") == 1) {
        glob_default.scale += 1;
        pan_default.rpos = pts_default.mult(pts_default.project(pan_default.wpos), glob_default.scale);
        console.log(glob_default.scale);
        purgeRemake();
      }
      if (app_default.key("c") == 1) {
        const chunks = loom_default.helpers.getEveryChunk(world_manager_default.world);
        console.log("chunks", chunks);
      }
      if (app_default.key("a") == 1) {
        console.log("arrays", world_manager_default.world.arrays);
      }
      if (app_default.key("t") == 1) {
        world_manager_default.world.grid.shrink();
        glob_default.reprerender = true;
        glob_default.dirtyobjects = true;
      }
      if (app_default.key("g") == 1) {
        world_manager_default.world.grid.grow();
        glob_default.reprerender = true;
        glob_default.dirtyobjects = true;
      }
      if (app_default.key("[") == 1) {
        tileform_default.hexscalar -= 0.1;
        console.log(tileform_default.hexscalar);
        purgeRemake();
      }
      if (app_default.key("]") == 1) {
        tileform_default.hexscalar += 0.1;
        console.log(tileform_default.hexscalar);
        purgeRemake();
      }
    }
  })(worldetch || (worldetch = {}));
  var worldetch_default = worldetch;

  // src/app.ts
  var app;
  ((app2) => {
    window["App"] = app2;
    let KEY;
    ((KEY2) => {
      KEY2[KEY2["OFF"] = 0] = "OFF";
      KEY2[KEY2["PRESS"] = 1] = "PRESS";
      KEY2[KEY2["WAIT"] = 2] = "WAIT";
      KEY2[KEY2["AGAIN"] = 3] = "AGAIN";
      KEY2[KEY2["UP"] = 4] = "UP";
    })(KEY = app2.KEY || (app2.KEY = {}));
    ;
    let MOUSE;
    ((MOUSE2) => {
      MOUSE2[MOUSE2["UP"] = -1] = "UP";
      MOUSE2[MOUSE2["OFF"] = 0] = "OFF";
      MOUSE2[MOUSE2["DOWN"] = 1] = "DOWN";
      MOUSE2[MOUSE2["STILL"] = 2] = "STILL";
    })(MOUSE = app2.MOUSE || (app2.MOUSE = {}));
    ;
    app2.feed = "abc";
    var keys = {};
    var buttons = {};
    var pos = [0, 0];
    app2.wheel = 0;
    app2.mobile = false;
    function onkeys(event) {
      if (!event.key)
        return;
      const key2 = event.key.toLowerCase();
      if ("keydown" == event.type)
        keys[key2] = keys[key2] ? 3 /* AGAIN */ : 1 /* PRESS */;
      else if ("keyup" == event.type)
        keys[key2] = 4 /* UP */;
      if (event.keyCode == 112 || event.keyCode == 113 || event.keyCode == 114 || event.keyCode == 115 || event.keyCode == 116)
        event.preventDefault();
    }
    app2.onkeys = onkeys;
    function key(k) {
      return keys[k];
    }
    app2.key = key;
    function button(b) {
      return buttons[b];
    }
    app2.button = button;
    function mouse() {
      return [...pos];
    }
    app2.mouse = mouse;
    async function boot(version) {
      console.log("boot");
      app2.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      function onmousemove(e) {
        pos[0] = e.clientX;
        pos[1] = e.clientY;
        hooks_default.emit("onmousemove", false);
      }
      function onmousedown(e) {
        buttons[e.button] = 1;
        if (e.button == 1)
          return false;
        hooks_default.emit("onmousedown", false);
      }
      function onmouseup(e) {
        buttons[e.button] = -1 /* UP */;
        hooks_default.emit("onmouseup", false);
      }
      function onwheel(e) {
        app2.wheel = e.deltaY < 0 ? 1 : -1;
      }
      let touchStart = [0, 0];
      function ontouchstart(e) {
        touchStart = [e.pageX, e.pageY];
        pos[0] = e.pageX;
        pos[1] = e.pageY;
        hooks_default.emit("onmousedown", false);
      }
      function ontouchmove(e) {
        pos[0] = e.pageX;
        pos[1] = e.pageY;
        buttons[0] = 1 /* PRESS */;
        e.preventDefault();
        hooks_default.emit("onmousemove", false);
        return false;
      }
      function ontouchend(e) {
        const touchEnd = [e.pageX, e.pageY];
        buttons[0] = -1 /* UP */;
        hooks_default.emit("onmouseup", false);
        if (pts_default.equals(touchEnd, touchStart)) {
        }
      }
      function onerror(message) {
        document.querySelectorAll(".stats")[0].innerHTML = message;
      }
      if (app2.mobile) {
        document.ontouchstart = ontouchstart;
        document.ontouchmove = ontouchmove;
        document.ontouchend = ontouchend;
      } else {
        document.onkeydown = document.onkeyup = onkeys;
        document.onmousemove = onmousemove;
        document.onmousedown = onmousedown;
        document.onmouseup = onmouseup;
        document.onwheel = onwheel;
      }
      await worldetch_default.init();
      const blockable = trick_animation_frame(base_loop);
    }
    app2.boot = boot;
    function process_keys() {
      for (let i in keys) {
        if (keys[i] == 1 /* PRESS */)
          keys[i] = 2 /* WAIT */;
        else if (keys[i] == 4 /* UP */)
          keys[i] = 0 /* OFF */;
      }
    }
    function process_mouse_buttons() {
      for (let b of [0, 1, 2])
        if (buttons[b] == 1 /* DOWN */)
          buttons[b] = 2 /* STILL */;
        else if (buttons[b] == -1 /* UP */)
          buttons[b] = 0 /* OFF */;
    }
    const take_time = (() => {
      let beginTime = (performance || Date).now(), prevTime = beginTime, frames = 0;
      return function() {
        frames++;
        var time = (performance || Date).now();
        if (time >= prevTime + 1e3) {
          let fps = frames * 1e3 / (time - prevTime);
          prevTime = time;
          frames = 0;
          glob_default.fps = fps;
        }
      };
    })();
    const take_delta = /* @__PURE__ */ (() => {
      let last = 0;
      return function() {
        const now = (performance || Date).now();
        let delta = (now - last) / 1e3;
        last = now;
        glob_default.delta = delta;
      };
    })();
    async function base_loop() {
      take_time();
      take_delta();
      await worldetch_default.step();
      await hooks_default.emit("animationFrame", 1);
      renderer_default.render();
      app2.wheel = 0;
      process_keys();
      process_mouse_buttons();
    }
    app2.base_loop = base_loop;
    async function trick_animation_frame(callback) {
      let run = true;
      do {
        await sleep();
        await callback();
      } while (run);
      return {
        runs: () => run,
        stop: () => run = false
      };
    }
    app2.trick_animation_frame = trick_animation_frame;
    async function sleep() {
      return new Promise(requestAnimationFrame);
    }
    function sethtml(selector, html) {
      let element = document.querySelector(selector);
      element.innerHTML = html;
    }
    app2.sethtml = sethtml;
  })(app || (app = {}));
  var app_default = app;

  // src/core/renderer.ts
  var fragment2 = `
float luma(vec3 color) {
	return dot(color, vec3(0.299, 0.587, 0.114));
	//return dot(color, vec3(0.5, 0.5, 0.5));
}

float dither8x8(vec2 position, float brightness) {
	int x = int(mod(position.x, 8.0));
	int y = int(mod(position.y, 8.0));
	int index = x + y * 8;
	float limit = 0.0;
  
	if (x < 8) {
	  if (index == 0) limit = 0.015625;
	  if (index == 1) limit = 0.515625;
	  if (index == 2) limit = 0.140625;
	  if (index == 3) limit = 0.640625;
	  if (index == 4) limit = 0.046875;
	  if (index == 5) limit = 0.546875;
	  if (index == 6) limit = 0.171875;
	  if (index == 7) limit = 0.671875;
	  if (index == 8) limit = 0.765625;
	  if (index == 9) limit = 0.265625;
	  if (index == 10) limit = 0.890625;
	  if (index == 11) limit = 0.390625;
	  if (index == 12) limit = 0.796875;
	  if (index == 13) limit = 0.296875;
	  if (index == 14) limit = 0.921875;
	  if (index == 15) limit = 0.421875;
	  if (index == 16) limit = 0.203125;
	  if (index == 17) limit = 0.703125;
	  if (index == 18) limit = 0.078125;
	  if (index == 19) limit = 0.578125;
	  if (index == 20) limit = 0.234375;
	  if (index == 21) limit = 0.734375;
	  if (index == 22) limit = 0.109375;
	  if (index == 23) limit = 0.609375;
	  if (index == 24) limit = 0.953125;
	  if (index == 25) limit = 0.453125;
	  if (index == 26) limit = 0.828125;
	  if (index == 27) limit = 0.328125;
	  if (index == 28) limit = 0.984375;
	  if (index == 29) limit = 0.484375;
	  if (index == 30) limit = 0.859375;
	  if (index == 31) limit = 0.359375;
	  if (index == 32) limit = 0.0625;
	  if (index == 33) limit = 0.5625;
	  if (index == 34) limit = 0.1875;
	  if (index == 35) limit = 0.6875;
	  if (index == 36) limit = 0.03125;
	  if (index == 37) limit = 0.53125;
	  if (index == 38) limit = 0.15625;
	  if (index == 39) limit = 0.65625;
	  if (index == 40) limit = 0.8125;
	  if (index == 41) limit = 0.3125;
	  if (index == 42) limit = 0.9375;
	  if (index == 43) limit = 0.4375;
	  if (index == 44) limit = 0.78125;
	  if (index == 45) limit = 0.28125;
	  if (index == 46) limit = 0.90625;
	  if (index == 47) limit = 0.40625;
	  if (index == 48) limit = 0.25;
	  if (index == 49) limit = 0.75;
	  if (index == 50) limit = 0.125;
	  if (index == 51) limit = 0.625;
	  if (index == 52) limit = 0.21875;
	  if (index == 53) limit = 0.71875;
	  if (index == 54) limit = 0.09375;
	  if (index == 55) limit = 0.59375;
	  if (index == 56) limit = 1.0;
	  if (index == 57) limit = 0.5;
	  if (index == 58) limit = 0.875;
	  if (index == 59) limit = 0.375;
	  if (index == 60) limit = 0.96875;
	  if (index == 61) limit = 0.46875;
	  if (index == 62) limit = 0.84375;
	  if (index == 63) limit = 0.34375;
	}
  
	return brightness < limit ? 0.0 : 1.0;
  }

float dither4x4(vec2 position, float brightness) {
	int x = int(mod(position.x, 4.0));
	int y = int(mod(position.y, 4.0));
	int index = x + y * 4;
	float limit = 0.0;

	if (x < 8) {
		if (index == 0) limit = 0.0625;
		if (index == 1) limit = 0.5625;
		if (index == 2) limit = 0.1875;
		if (index == 3) limit = 0.6875;
		if (index == 4) limit = 0.8125;
		if (index == 5) limit = 0.3125;
		if (index == 6) limit = 0.9375;
		if (index == 7) limit = 0.4375;
		if (index == 8) limit = 0.25;
		if (index == 9) limit = 0.75;
		if (index == 10) limit = 0.125;
		if (index == 11) limit = 0.625;
		if (index == 12) limit = 1.0;
		if (index == 13) limit = 0.5;
		if (index == 14) limit = 0.875;
		if (index == 15) limit = 0.375;
	}

	return brightness < limit ? 0.0 : 1.0;
}
  
vec3 dither4x4(vec2 position, vec3 color) {
	return color * dither4x4(position, luma(color));
}

vec3 dither8x8(vec2 position, vec3 color) {
	return color * dither8x8(position, luma(color));
}

float saturation = 2.0;

uniform int compression;
uniform int dithering;

// 24 is best
// 32 is nice
// 48 is mild
float factor = 24.0;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

	outputColor = vec4(floor(inputColor.rgb * factor + 0.5) / factor, inputColor.a);

}

// Todo add effect
varying vec2 vUv;
uniform sampler2D tDiffuse;
void main() {
	vec4 clr = texture2D( tDiffuse, vUv );
	// clr.rgb = mix(clr.rgb, vec3(1.0, 0, 0), 0.5);
	
	if (compression == 1) {
		mainImage(clr, vUv, clr);
	}

	/*vec3 original_color = clr.rgb;
	vec3 lumaWeights = vec3(.25,.50,.25);
	vec3 grey = vec3(dot(lumaWeights,original_color));
	clr = vec4(grey + saturation * (original_color - grey), 1.0);*/
	
	gl_FragColor = clr;
	if (dithering == 1) {
		gl_FragColor.rgb = dither4x4(gl_FragCoord.xy, gl_FragColor.rgb);
	}
}`;
  var fragment3 = `
varying vec2 vUv;
uniform sampler2D tDiffuse;
void main() {
	vec4 clr = texture2D( tDiffuse, vUv );
	// clr.rgb = mix(clr.rgb, vec3(1.0, 0, 0), 0.5);
	gl_FragColor = clr;
}`;
  var vertexScreen = `
varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;
  var renderer;
  ((_renderer) => {
    _renderer.cameraMode = "ortho";
    _renderer.DOTS_PER_INCH_CORRECTED_RENDER_TARGET = true;
    _renderer.ROUND_UP_DOTS_PER_INCH = true;
    _renderer.USE_SCENE3 = true;
    _renderer.dotsPerInch = 1;
    _renderer.dithering = true;
    _renderer.compression = false;
    let groups;
    ((groups2) => {
    })(groups = _renderer.groups || (_renderer.groups = {}));
    function render() {
      if (app_default.key("z") == 1)
        _renderer.material2.uniforms.compression.value = _renderer.compression = !_renderer.compression;
      if (app_default.key("d") == 1)
        _renderer.material2.uniforms.dithering.value = _renderer.dithering = !_renderer.dithering;
      if (glob_default.dirtyobjects) {
        _renderer.renderer.setRenderTarget(_renderer.target);
        _renderer.renderer.clear();
        _renderer.renderer.render(_renderer.scene, _renderer.camera);
      }
      if (_renderer.USE_SCENE3) {
        _renderer.camera2.scale.set(1 / 2, 1 / 2, 1 / 2);
        _renderer.camera2.updateMatrix();
        _renderer.renderer.setRenderTarget(_renderer.target2);
      } else {
        _renderer.renderer.setRenderTarget(null);
      }
      _renderer.renderer.clear();
      _renderer.renderer.render(_renderer.scene2, _renderer.camera2);
      if (_renderer.USE_SCENE3) {
        _renderer.renderer.setRenderTarget(null);
        _renderer.renderer.clear();
        _renderer.renderer.render(_renderer.scene3, _renderer.camera3);
      }
      glob_default.dirtyobjects = false;
    }
    _renderer.render = render;
    function purge() {
      onWindowResize();
    }
    _renderer.purge = purge;
    function init() {
      console.log("pipeline init");
      glob_default.dirtyobjects = true;
      THREE.ColorManagement.enabled = false;
      THREE.Object3D.DEFAULT_MATRIX_AUTO_UPDATE = true;
      THREE.Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = true;
      groups.camera = new THREE.Group();
      groups.sprites = new THREE.Group();
      groups.sprites.visible = false;
      groups.sprites.frustumCulled = false;
      groups.monolith = new THREE.Group();
      _renderer.scene = new THREE.Scene();
      _renderer.scene.frustumCulled = false;
      _renderer.scene.add(groups.camera);
      _renderer.scene.add(groups.sprites);
      _renderer.scene.add(groups.monolith);
      _renderer.scene.background = new THREE.Color("#333");
      _renderer.ambientLight = new THREE.AmbientLight("white", Math.PI / 2);
      _renderer.scene.add(_renderer.ambientLight);
      _renderer.scene2 = new THREE.Scene();
      _renderer.scene2.frustumCulled = false;
      _renderer.scene2.background = new THREE.Color("green");
      _renderer.scene2.add(new THREE.AmbientLight("white", Math.PI / 1));
      _renderer.scene3 = new THREE.Scene();
      _renderer.scene3.frustumCulled = false;
      _renderer.scene3.background = new THREE.Color("purple");
      _renderer.scene3.add(new THREE.AmbientLight("white", Math.PI / 1));
      _renderer.sceneMask = new THREE.Scene();
      _renderer.sceneMask.add(new THREE.AmbientLight("white", Math.PI / 1));
      if (_renderer.DOTS_PER_INCH_CORRECTED_RENDER_TARGET) {
        _renderer.dotsPerInch = window.devicePixelRatio;
        if (_renderer.ROUND_UP_DOTS_PER_INCH)
          _renderer.dotsPerInch = Math.ceil(_renderer.dotsPerInch);
      }
      glob_default.dotsPerInch = _renderer.dotsPerInch;
      _renderer.target = new THREE.WebGLRenderTarget(1024, 1024, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        colorSpace: THREE.NoColorSpace,
        generateMipmaps: false
      });
      if (_renderer.USE_SCENE3) {
        _renderer.target2 = _renderer.target.clone();
      }
      _renderer.targetMask = _renderer.target.clone();
      _renderer.renderer = new THREE.WebGLRenderer({
        antialias: false
        // premultipliedAlpha: false
      });
      glob_default.renderer = _renderer.renderer;
      _renderer.renderer.setPixelRatio(_renderer.dotsPerInch);
      _renderer.renderer.setSize(100, 100);
      _renderer.renderer.setClearColor(16777215, 0);
      _renderer.renderer.autoClear = true;
      _renderer.renderer.toneMapping = THREE.NoToneMapping;
      document.body.appendChild(_renderer.renderer.domElement);
      window.addEventListener("resize", onWindowResize, false);
      window.pipeline = _renderer.renderer;
      onWindowResize();
    }
    _renderer.init = init;
    _renderer.screenSize = [0, 0];
    _renderer.targetSize = [0, 0];
    function onWindowResize() {
      _renderer.screenSize = [window.innerWidth, window.innerHeight];
      _renderer.screenSize = pts_default.floor(_renderer.screenSize);
      _renderer.targetSize = pts_default.copy(_renderer.screenSize);
      if (_renderer.DOTS_PER_INCH_CORRECTED_RENDER_TARGET) {
        _renderer.targetSize = pts_default.mult(_renderer.screenSize, _renderer.dotsPerInch);
        _renderer.targetSize = pts_default.floor(_renderer.targetSize);
      }
      _renderer.renderer.setSize(_renderer.screenSize[0], _renderer.screenSize[1]);
      console.log(`
		window inner ${pts_default.to_string(_renderer.screenSize)}

		      new is ${pts_default.to_string(_renderer.targetSize)}`);
      _renderer.target.setSize(_renderer.targetSize[0], _renderer.targetSize[1]);
      _renderer.targetMask.setSize(_renderer.targetSize[0], _renderer.targetSize[1]);
      if (_renderer.USE_SCENE3)
        _renderer.target2.setSize(_renderer.targetSize[0], _renderer.targetSize[1]);
      _renderer.plane?.dispose();
      _renderer.plane = new THREE.PlaneGeometry(_renderer.targetSize[0], _renderer.targetSize[1]);
      glob_default.dirtyobjects = true;
      _renderer.material2?.dispose();
      _renderer.material2 = new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: _renderer.target.texture },
          compression: { value: _renderer.compression },
          dithering: { value: _renderer.dithering }
        },
        vertexShader: vertexScreen,
        fragmentShader: fragment2,
        depthTest: false,
        depthWrite: false
      });
      _renderer.quad2 = new THREE.Mesh(_renderer.plane, _renderer.material2);
      while (_renderer.scene2.children.length > 0)
        _renderer.scene2.remove(_renderer.scene2.children[0]);
      _renderer.scene2.add(_renderer.quad2);
      if (_renderer.USE_SCENE3) {
        _renderer.material3?.dispose();
        _renderer.material3 = new THREE.ShaderMaterial({
          uniforms: {
            tDiffuse: { value: _renderer.target2.texture }
          },
          vertexShader: vertexScreen,
          fragmentShader: fragment3,
          depthTest: false,
          depthWrite: false
        });
        _renderer.quad3 = new THREE.Mesh(_renderer.plane, _renderer.material3);
        while (_renderer.scene3.children.length > 0)
          _renderer.scene3.remove(_renderer.scene3.children[0]);
        _renderer.scene3.add(_renderer.quad3);
      }
      while (groups.camera.children.length > 0)
        groups.camera.remove(groups.camera.children[0]);
      if (_renderer.cameraMode == "perspective") {
        _renderer.camera = new THREE.PerspectiveCamera(
          45,
          window.innerWidth / window.innerHeight,
          0.1,
          1e3
        );
        _renderer.camera.position.z = 200;
        _renderer.camera.updateMatrix();
        groups.camera.rotation.x = Math.PI / 12;
        groups.camera.add(_renderer.camera);
        groups.camera.updateMatrix();
      } else {
        _renderer.camera = makeOrthographicCamera(_renderer.targetSize[0], _renderer.targetSize[1]);
        groups.camera.add(_renderer.camera);
        groups.camera.add(new THREE.AxesHelper(20));
        _renderer.camera.rotation.x = glob_default.magiccamerarotation;
      }
      _renderer.camera.updateMatrix();
      _renderer.camera.updateProjectionMatrix();
      _renderer.camera2 = makeOrthographicCamera(_renderer.targetSize[0], _renderer.targetSize[1]);
      _renderer.camera2.updateProjectionMatrix();
      _renderer.camera3 = makeOrthographicCamera(_renderer.targetSize[0], _renderer.targetSize[1]);
      _renderer.camera3.updateProjectionMatrix();
    }
    let mem = [];
    async function preloadTextureAsync(file, mode = "nearest") {
      let texture = await new THREE.TextureLoader().loadAsync(file + `?v=${app_default.feed}`);
      mem[file] = texture;
      texture.generateMipmaps = false;
      texture.center.set(0, 1);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      if (mode === "linear") {
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
      } else if (mode === "nearest") {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
      }
    }
    _renderer.preloadTextureAsync = preloadTextureAsync;
    function getTexture(file) {
      return mem[file];
    }
    _renderer.getTexture = getTexture;
    function makeRenderTarget(width, height) {
      return new THREE.WebGLRenderTarget(width, height, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        colorSpace: THREE.NoColorSpace,
        generateMipmaps: false
      });
    }
    _renderer.makeRenderTarget = makeRenderTarget;
    function makeOrthographicCamera(w, h) {
      let camera4 = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, -500, 500);
      camera4.updateProjectionMatrix();
      return camera4;
    }
    _renderer.makeOrthographicCamera = makeOrthographicCamera;
    function utilEraseChildren(group) {
      while (group.children.length > 0)
        group.remove(group.children[0]);
    }
    _renderer.utilEraseChildren = utilEraseChildren;
  })(renderer || (renderer = {}));
  var renderer_default = renderer;

  // src/dep/toggle.ts
  var toggle = class {
    constructor() {
      __publicField(this, "_active", false);
    }
    get active() {
      return this._active;
    }
    on() {
      if (this.active)
        return true;
      this._active = true;
      return false;
    }
    off() {
      if (!this.active)
        return true;
      this._active = false;
      return false;
    }
  };
  var toggle_default = toggle;

  // src/core/loom.ts
  var loom;
  ((loom2) => {
    const chunk_coloration = false;
    const fog_of_war = false;
    const grid_crawl_makes_chunks = false;
    loom2.chunk_span = 3;
    function init() {
      console.log("init");
      const world2 = new loom2.world(10);
      return world2;
    }
    loom2.init = init;
    function register() {
    }
    loom2.register = register;
    function project(unit) {
      return pts_default.mult(pts_default.project(unit), glob_default.scale);
    }
    loom2.project = project;
    function unproject(pixel) {
      return pts_default.divide(pts_default.unproject(pixel), glob_default.scale);
    }
    loom2.unproject = unproject;
    function add(world2, obj2) {
      if (!obj2)
        return;
      world2.chunkAtWpos(obj2.wpos).add(obj2);
    }
    loom2.add = add;
    function addDontYetShow(world2, obj2) {
      if (!obj2)
        return;
      world2.chunkAtWpos(obj2.wpos).add(obj2, false);
    }
    loom2.addDontYetShow = addDontYetShow;
    function remove(obj2) {
      obj2.chunk?.remove(obj2);
    }
    loom2.remove = remove;
    class world {
      constructor(useless_value) {
        // By design the c lod only has a single observer
        // If you need more grids, for filtering purposes
        // or for creating larger or smaller skirts,
        // decouple the grid from the world here
        // then make sure the optional grids don't hide or show chunks 
        __publicField(this, "grid");
        __publicField(this, "arrays", []);
        this.grid = new grid(this, 2, 2);
      }
      update(wpos2) {
        this.grid.cpos = loom2.world.wtocpos(wpos2);
        this.grid.ons();
        this.grid.offs();
        this.grid.runs();
      }
      lookup(big) {
        if (this.arrays[big[1]] == void 0)
          this.arrays[big[1]] = [];
        return this.arrays[big[1]][big[0]];
      }
      at(cpos) {
        return this.lookup(cpos) || this._make(cpos);
      }
      chunkAtWpos(wpos2) {
        return this.at(world.wtocpos(wpos2));
      }
      _make(cpos) {
        let ch = this.lookup(cpos);
        if (ch)
          return ch;
        return this.arrays[cpos[1]][cpos[0]] = new chunk(cpos, this);
      }
      static wtocpos(w) {
        return pts_default.floor(pts_default.divide(w, loom2.chunk_span));
      }
      // todo add(obj) {}
      // todo remove(obj) {}
    }
    loom2.world = world;
    class chunk extends toggle_default {
      constructor(cpos, world2) {
        super();
        this.cpos = cpos;
        this.world = world2;
        __publicField(this, "group");
        __publicField(this, "color");
        __publicField(this, "fog_of_war", false);
        __publicField(this, "small");
        __publicField(this, "objs", []);
        if (chunk_coloration)
          this.color = ["lightsalmon", "lightblue", "beige", "pink"][Math.floor(Math.random() * 4)];
        let min = pts_default.mult(this.cpos, loom2.chunk_span);
        let max = pts_default.add(min, [loom2.chunk_span - 1, loom2.chunk_span - 1]);
        this.small = new aabb2_default(max, min);
        this.group = new THREE.Group();
        this.group.frustumCulled = false;
        this.group.matrixAutoUpdate = false;
        numbers.chunks[1]++;
        world2.arrays[this.cpos[1]][this.cpos[0]] = this;
        hooks.emit("chunkCreate", this);
      }
      nuke() {
        numbers.chunks[1]--;
        this.hide();
        for (const obj2 of this.objs) {
          obj2.finalize();
        }
        this.objs.splice(0, this.objs.length);
        this.objs.length = 0;
      }
      add(obj2, show = true) {
        if (this.objs.includes(obj2) == false) {
          this.objs.push(obj2);
          obj2.chunk = this;
          if (this.active && show)
            obj2.show();
        }
      }
      remove(obj2) {
        let i = this.objs.indexOf(obj2);
        if (i > -1) {
          obj2.chunk = null;
          return !!this.objs.splice(i, 1).length;
        }
      }
      // Get all things at one point
      objsatwpos(wpos2) {
        const stack = [];
        for (const obj2 of this.objs)
          if (pts_default.equals(
            pts_default.round(wpos2),
            pts_default.round(obj2.wpos)
          ))
            stack.push(obj2);
        return stack;
      }
      static swap(obj2) {
        let oldChunk = obj2.chunk;
        let newChunk = oldChunk.world.chunkAtWpos(
          /*pts.round(*/
          obj2.wpos
          /*)*/
        );
        if (oldChunk != newChunk) {
          oldChunk.remove(obj2);
          newChunk.add(obj2);
          if (!newChunk.active)
            obj2.hide();
        }
      }
      tick() {
        hooks.emit("chunkTick", this);
      }
      show() {
        if (this.on())
          return;
        numbers.chunks[0]++;
        for (const obj2 of this.objs)
          obj2.show();
        renderer_default.scene.add(this.group);
        hooks.emit("chunkShow", this);
      }
      hide() {
        if (this.off())
          return;
        numbers.chunks[0]--;
        for (const obj2 of this.objs)
          obj2.hide();
        renderer_default.scene.remove(this.group);
        hooks.emit("chunkHide", this);
      }
      dist() {
        return pts_default.distsimple(this.cpos, this.world.grid.cpos);
      }
      grayscale() {
        this.color = "gray";
      }
    }
    loom2.chunk = chunk;
    class grid {
      constructor(world2, spread, outside) {
        this.world = world2;
        this.spread = spread;
        this.outside = outside;
        // the observer
        __publicField(this, "cpos", [0, 0]);
        __publicField(this, "shown", []);
        __publicField(this, "visibleObjs", []);
        if (this.outside < this.spread) {
          console.warn(" outside less than spread ", this.spread, this.outside);
          this.outside = this.spread;
        }
      }
      grow() {
        this.spread++;
        this.outside++;
      }
      shrink() {
        this.spread--;
        this.outside--;
      }
      visible(chunk2) {
        return chunk2.dist() < this.spread;
      }
      ons() {
        for (let y = -this.spread; y < this.spread + 1; y++) {
          for (let x = -this.spread; x < this.spread + 1; x++) {
            let pos = pts_default.add(this.cpos, [x, y]);
            let chunk2 = grid_crawl_makes_chunks ? this.world.at(pos) : this.world.lookup(pos);
            if (!chunk2)
              continue;
            if (!chunk2.active) {
              this.shown.push(chunk2);
              chunk2.show();
            }
          }
        }
      }
      offs() {
        this.visibleObjs = [];
        let i = this.shown.length;
        while (i--) {
          let chunk2;
          chunk2 = this.shown[i];
          if (chunk2.dist() > this.outside) {
            chunk2.hide();
            this.shown.splice(i, 1);
          } else {
            chunk2.tick();
            this.visibleObjs = this.visibleObjs.concat(chunk2.objs);
          }
          if (fog_of_war) {
            if (chunk2.dist() >= this.outside) {
              chunk2.fog_of_war = true;
            } else {
              chunk2.fog_of_war = false;
            }
          }
        }
      }
      runs() {
        for (let chunk2 of this.shown)
          for (let obj2 of chunk2.objs)
            obj2.step();
      }
    }
    loom2.grid = grid;
    ;
    const _obj = class _obj extends toggle_default {
      constructor(counts = numbers.objs) {
        super();
        this.counts = counts;
        __publicField(this, "id", -1);
        __publicField(this, "wpos", [0, 0]);
        __publicField(this, "rpos", [0, 0]);
        __publicField(this, "size", [64, 64]);
        __publicField(this, "chunk");
        __publicField(this, "bound");
        __publicField(this, "expand", 0.5);
        this.counts[1]++;
        this.id = _obj.ids++;
      }
      finalize() {
        this.counts[1]--;
        this.hide();
      }
      show() {
        if (this.on())
          return;
        this.counts[0]++;
        this._create();
      }
      hide() {
        if (this.off())
          return;
        this.counts[0]--;
        this._delete();
      }
      rebound() {
        this.bound = new aabb2_default([-this.expand, -this.expand], [this.expand, this.expand]);
        this.bound.translate(this.wpos);
      }
      _wtorpos() {
        this.rpos = loom2.project(this.wpos);
        this.rpos = pts_default.floor(this.rpos);
      }
      _rtospos() {
        this._wtorpos();
        return pts_default.copy(this.rpos);
      }
      //create() { // Use show() instead!
      //	this._create();
      //}
      // delete() { // Use hide() instead!
      //	this._delete();
      //}
      step() {
        this._step();
      }
      _create() {
        console.warn(" empty create ");
      }
      _delete() {
      }
      // Todo,
      // Flag the Rpos as unclean when the Wpos is changed
      // using getters and setters?
      _step() {
        this._wtorpos();
        this.rebound();
      }
    };
    __publicField(_obj, "ids", 0);
    let obj = _obj;
    loom2.obj = _obj;
    let helpers;
    ((helpers2) => {
      function getEveryChunk(world2) {
        let chunks = [];
        for (const i in world2.arrays) {
          for (const j in world2.arrays[i]) {
            chunks.push(world2.arrays[i][j]);
          }
        }
        return chunks;
      }
      helpers2.getEveryChunk = getEveryChunk;
      function getMatrix(world2, center) {
        const directions = [
          [-1, 1],
          [0, 1],
          [1, 1],
          [-1, 0],
          [0, 0],
          [1, 0],
          [-1, -1],
          [0, -1],
          [1, -1]
        ];
        let matrix = [];
        directions.forEach((pos, index) => {
          pos = pts_default.add(pos, center);
          matrix[index] = world2.chunkAtWpos(pos).objsatwpos(pos);
        });
        return matrix;
      }
      helpers2.getMatrix = getMatrix;
    })(helpers = loom2.helpers || (loom2.helpers = {}));
    let numbers;
    ((numbers2) => {
      numbers2.chunks = [0, 0];
      numbers2.objs = [0, 0];
      numbers2.sprites = [0, 0];
      numbers2.tiles = [0, 0];
      numbers2.walls = [0, 0];
    })(numbers = loom2.numbers || (loom2.numbers = {}));
    ;
  })(loom || (loom = {}));
  var loom_default = loom;

  // src/core/objects/wall.ts
  var wall = class extends game_object_default {
    constructor(data) {
      super({
        name: "a wall",
        ...data
      });
      this.data._type = "wall";
    }
    _create() {
      new sprite_default({
        gobj: this,
        bottomSort: true,
        spriteSize: [glob_default.hexsize[0], 21],
        spriteImage: "hex/wall.png",
        spriteColor: "blue"
      });
      this.sprite?.create();
    }
    /*protected override _delete() {
    	console.log('delete');
    }*/
  };
  var wall_default = wall;

  // src/core/objects/factory motivation.ts
  function game_object_factory(data) {
    let gobj;
    switch (data._type) {
      case "direct":
        console.warn(" unset type passed to factory ");
        break;
      case "tile":
        gobj = new tile_default(data);
        break;
      case "wall":
        gobj = new wall_default(data);
        break;
    }
    return gobj;
  }
  var factory_motivation_default = game_object_factory;

  // src/index.ts
  var worldetch2 = {
    loom: loom_default,
    direction_adapter: direction_adapter_default,
    object3d: object_3d_default,
    renderer: renderer_default,
    sprite: sprite_default,
    staggered_area: staggered_area_default,
    tileform: tileform_default,
    WorldManager: world_manager_default,
    objects: {
      game_object_factory: factory_motivation_default,
      game_object: game_object_default,
      light: light_default,
      tile3d: tile_3d_default,
      wall3d: wall_3d_default
    },
    dep: {
      aabb2: aabb2_default,
      area2: area2_default,
      glob: glob_default,
      hooks: hooks_default,
      pts: pts_default
    }
  };
  return __toCommonJS(index_exports);
})();
