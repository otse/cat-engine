import { default as THREE, OrthographicCamera, PerspectiveCamera, Clock, Scene, WebGLRenderer, TextureLoader, WebGLRenderTarget, ShaderMaterial, Mesh, PlaneGeometry, Color, NearestFilter, RGBAFormat, Group, AmbientLight } from 'three';
import app from '../app.js';
import pts from '../lib/pts.js';
export { THREE };
const fragmentBackdrop = `
varying vec2 vUv;
//uniform float time;
void main() {
	gl_FragColor = vec4( 0.5, 0.5, 0.5, 1.0 );
}`;
const fragmentPost = `
float saturation = 2.0;

uniform int compression;

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
	//clr.rgb = mix(clr.rgb, vec3(0.5), 0.0);
	
	if (compression == 1) {
	mainImage(clr, vUv, clr);
	}

	//vec3 original_color = clr.rgb;
	//vec3 lumaWeights = vec3(.25,.50,.25);
	//vec3 grey = vec3(dot(lumaWeights,original_color));
	//clr = vec4(grey + saturation * (original_color - grey), 1.0);
	
	gl_FragColor = clr;
}`;
const vertexScreen = `
varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;
var renderer;
(function (renderer_1) {
    renderer_1.DPI_UPSCALED_RT = true;
    renderer_1.ndpi = 1;
    renderer_1.delta = 0;
    let groups;
    (function (groups) {
    })(groups = renderer_1.groups || (renderer_1.groups = {}));
    //export var ambientLight: AmbientLight
    //export var directionalLight: DirectionalLight
    function update() {
        renderer_1.delta = renderer_1.clock.getDelta();
        if (renderer_1.delta > 1)
            renderer_1.delta = 0.016;
        //delta *= 60.0;
        //filmic.composer.render();
    }
    renderer_1.update = update;
    var reset = 0;
    var frames = 0;
    // https://github.com/mrdoob/stats.js/blob/master/src/Stats.js#L71
    function calc() {
        const s = Date.now() / 1000;
        frames++;
        if (s - reset >= 1) {
            reset = s;
            renderer_1.fps = frames;
            frames = 0;
        }
        renderer_1.memory = window.performance.memory;
    }
    renderer_1.calc = calc;
    let alternate = true;
    function render() {
        const allowColorDepthToggle = true;
        if (allowColorDepthToggle)
            if (app.key('z') == 1)
                renderer_1.materialPost.uniforms.compression.value = !renderer_1.materialPost.uniforms.compression.value;
        /*alternate = ! alternate;
        if (alternate) {
            return;
        }*/
        calc();
        renderer_1.renderer.setRenderTarget(renderer_1.targetMask);
        renderer_1.renderer.clear();
        renderer_1.renderer.render(renderer_1.sceneMask, renderer_1.camera);
        renderer_1.renderer.setRenderTarget(renderer_1.target);
        renderer_1.renderer.clear();
        renderer_1.renderer.render(renderer_1.scene, renderer_1.camera);
        //scene.overrideMaterial = new THREE.MeshDepthMaterial();
        renderer_1.renderer.setRenderTarget(null);
        renderer_1.renderer.clear();
        renderer_1.renderer.render(renderer_1.scene2, renderer_1.camera2);
    }
    renderer_1.render = render;
    function init() {
        console.log('renderer init');
        renderer_1.clock = new Clock();
        THREE.ColorManagement.enabled = false;
        THREE.Object3D.DefaultMatrixAutoUpdate = true;
        groups.axisSwap = new Group;
        groups.axisSwap.frustumCulled = false;
        groups.axisSwap.matrixAutoUpdate = false;
        groups.axisSwap.matrixWorldAutoUpdate = false;
        renderer_1.scene = new Scene();
        renderer_1.scene.frustumCulled = false;
        renderer_1.scene.matrixAutoUpdate = false;
        renderer_1.scene.matrixWorldAutoUpdate = false;
        renderer_1.scene.add(groups.axisSwap);
        renderer_1.scene.background = new Color('#333');
        //scene.background.fromArray(([51/255,51/255,51/255, 1]));
        renderer_1.scene2 = new Scene();
        renderer_1.scene2.matrixAutoUpdate = false;
        renderer_1.sceneMask = new Scene();
        //sceneMask.background = new Color('#fff');
        renderer_1.sceneMask.add(new AmbientLight(0xffffff, 1));
        renderer_1.ambientLight = new AmbientLight(0xffffff, 1);
        renderer_1.scene.add(renderer_1.ambientLight);
        if (renderer_1.DPI_UPSCALED_RT)
            renderer_1.ndpi = window.devicePixelRatio;
        renderer_1.target = new WebGLRenderTarget(1024, 1024, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat
        });
        renderer_1.targetMask = renderer_1.target.clone();
        renderer_1.renderer = new WebGLRenderer({ antialias: false });
        renderer_1.renderer.setPixelRatio(renderer_1.ndpi);
        renderer_1.renderer.setSize(100, 100);
        renderer_1.renderer.autoClear = true;
        renderer_1.renderer.setClearColor(0xffffff, 0.0);
        renderer_1.renderer.outputColorSpace = THREE.RGBColorSpace;
        //renderer.setClearAlpha(1.0);
        document.body.appendChild(renderer_1.renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
        renderer_1.materialPost = new ShaderMaterial({
            uniforms: {
                tDiffuse: { value: renderer_1.target.texture },
                compression: { value: 1 }
            },
            vertexShader: vertexScreen,
            fragmentShader: fragmentPost,
            depthWrite: false
        });
        onWindowResize();
        renderer_1.quadPost = new Mesh(renderer_1.plane, renderer_1.materialPost);
        renderer_1.quadPost.matrixAutoUpdate = false;
        //quadPost.position.z = -100;
        renderer_1.scene2.add(renderer_1.quadPost);
        window.ren = renderer_1.renderer;
    }
    renderer_1.init = init;
    renderer_1.screen = [0, 0];
    renderer_1.screenCorrected = [0, 0];
    function onWindowResize() {
        renderer_1.screen = [window.innerWidth, window.innerHeight];
        //screen = pts.divide(screen, 2);
        renderer_1.screen = pts.floor(renderer_1.screen);
        //screen = pts.even(screen, -1);
        //screen = [800, 600];
        renderer_1.screenCorrected = pts.clone(renderer_1.screen);
        if (renderer_1.DPI_UPSCALED_RT) {
            //screen = pts.floor(screen);
            renderer_1.screenCorrected = pts.mult(renderer_1.screen, renderer_1.ndpi);
            renderer_1.screenCorrected = pts.floor(renderer_1.screenCorrected);
            renderer_1.screenCorrected = pts.even(renderer_1.screenCorrected, -1);
        }
        console.log(`
		window inner ${pts.to_string(renderer_1.screen)}\n
		      new is ${pts.to_string(renderer_1.screenCorrected)}`);
        renderer_1.target.setSize(renderer_1.screenCorrected[0], renderer_1.screenCorrected[1]);
        renderer_1.targetMask.setSize(renderer_1.screenCorrected[0], renderer_1.screenCorrected[1]);
        renderer_1.plane = new PlaneGeometry(renderer_1.screenCorrected[0], renderer_1.screenCorrected[1]);
        if (renderer_1.quadPost)
            renderer_1.quadPost.geometry = renderer_1.plane;
        const cameraMode = 0;
        if (cameraMode) {
            renderer_1.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
            //camera.zoom = camera.aspect; // scales "to fit" rather than zooming out
            renderer_1.camera.position.z = 800;
        }
        else {
            renderer_1.camera = make_orthographic_camera(renderer_1.screenCorrected[0], renderer_1.screenCorrected[1]);
        }
        renderer_1.camera2 = make_orthographic_camera(renderer_1.screenCorrected[0], renderer_1.screenCorrected[1]);
        renderer_1.camera2.updateProjectionMatrix();
        renderer_1.renderer.setSize(renderer_1.screen[0], renderer_1.screen[1]);
    }
    let mem = [];
    function load_texture(file, mode = 1, cb, key) {
        if (mem[key || file])
            return mem[key || file];
        let texture = new TextureLoader().load(file + `?v=${app.feed}`, cb);
        texture.generateMipmaps = false;
        texture.center.set(0, 1);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        if (mode) {
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
        }
        else {
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
        }
        mem[key || file] = texture;
        return texture;
    }
    renderer_1.load_texture = load_texture;
    function make_render_target(w, h) {
        const o = {
            minFilter: NearestFilter,
            magFilter: NearestFilter,
            format: RGBAFormat
        };
        let target = new WebGLRenderTarget(w, h, o);
        return target;
    }
    renderer_1.make_render_target = make_render_target;
    function make_orthographic_camera(w, h) {
        let camera = new OrthographicCamera(w / -2, w / 2, h / 2, h / -2, -100, 100);
        camera.updateProjectionMatrix();
        return camera;
    }
    renderer_1.make_orthographic_camera = make_orthographic_camera;
    function erase_children(group) {
        while (group.children.length > 0)
            group.remove(group.children[0]);
    }
    renderer_1.erase_children = erase_children;
})(renderer || (renderer = {}));
export default renderer;
