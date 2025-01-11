import app from '../app.js';
import pts from '../lib/pts.js';
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
var pipeline;
(function (pipeline) {
    pipeline.DOTS_PER_INCH_CORRECTED_RENDER_TARGET = true;
    pipeline.dotsPerInch = 1;
    pipeline.delta = 0;
    let groups;
    (function (groups) {
    })(groups = pipeline.groups || (pipeline.groups = {}));
    function render() {
        const allowColorDepthToggle = true;
        if (allowColorDepthToggle)
            if (app.key('z') == 1)
                pipeline.materialPost.uniforms.compression.value = !pipeline.materialPost.uniforms.compression.value;
        pipeline.renderer.setRenderTarget(pipeline.targetMask);
        pipeline.renderer.clear();
        pipeline.renderer.render(pipeline.sceneMask, pipeline.camera);
        pipeline.renderer.setRenderTarget(pipeline.target);
        pipeline.renderer.clear();
        pipeline.renderer.render(pipeline.scene, pipeline.camera);
        pipeline.renderer.setRenderTarget(null);
        pipeline.renderer.clear();
        pipeline.renderer.render(pipeline.scenePost, pipeline.camera2);
    }
    pipeline.render = render;
    function init() {
        console.log('pipeline init');
        pipeline.clock = new THREE.Clock();
        THREE.ColorManagement.enabled = false;
        THREE.Object3D.DefaultMatrixAutoUpdate = false;
        groups.major = new THREE.Group;
        groups.major.frustumCulled = false;
        groups.major.matrixAutoUpdate = false;
        groups.major.matrixWorldAutoUpdate = false;
        pipeline.scene = new THREE.Scene();
        pipeline.scene.frustumCulled = false;
        pipeline.scene.add(groups.major);
        pipeline.scene.background = new THREE.Color('purple');
        pipeline.scenePost = new THREE.Scene();
        pipeline.scenePost.frustumCulled = false;
        pipeline.scenePost.background = new THREE.Color('red');
        pipeline.sceneMask = new THREE.Scene();
        pipeline.sceneMask.add(new THREE.AmbientLight(0xffffff, 1));
        pipeline.ambientLight = new THREE.AmbientLight(0xffffff, 1);
        pipeline.scene.add(pipeline.ambientLight);
        if (pipeline.DOTS_PER_INCH_CORRECTED_RENDER_TARGET) {
            pipeline.dotsPerInch = window.devicePixelRatio;
        }
        pipeline.target = new THREE.WebGLRenderTarget(1024, 1024, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat
        });
        pipeline.targetMask = pipeline.target.clone();
        pipeline.renderer = new THREE.WebGLRenderer({ antialias: false });
        pipeline.renderer.setPixelRatio(pipeline.dotsPerInch);
        pipeline.renderer.setSize(100, 100);
        pipeline.renderer.setClearColor(0xffffff, 0);
        pipeline.renderer.autoClear = true;
        pipeline.renderer.outputColorSpace = THREE.RGBColorSpace;
        //renderer.setClearAlpha(1.0);
        document.body.appendChild(pipeline.renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
        pipeline.materialPost = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: pipeline.target.texture },
                compression: { value: 1 }
            },
            vertexShader: vertexScreen,
            fragmentShader: fragmentPost,
            depthWrite: false
        });
        onWindowResize();
        pipeline.quadPost = new THREE.Mesh(pipeline.plane, pipeline.materialPost);
        pipeline.scenePost.add(pipeline.quadPost);
        window.pipeline = pipeline;
    }
    pipeline.init = init;
    pipeline.screenSize = [0, 0];
    pipeline.targetSize = [0, 0];
    function onWindowResize() {
        pipeline.screenSize = [window.innerWidth, window.innerHeight];
        pipeline.screenSize = pts.floor(pipeline.screenSize);
        pipeline.targetSize = pts.clone(pipeline.screenSize);
        if (pipeline.DOTS_PER_INCH_CORRECTED_RENDER_TARGET) {
            pipeline.targetSize = pts.mult(pipeline.screenSize, pipeline.dotsPerInch);
            pipeline.targetSize = pts.floor(pipeline.targetSize);
            pipeline.targetSize = pts.even(pipeline.targetSize, -1);
        }
        console.log(`
		window inner ${pts.to_string(pipeline.screenSize)}\n
		      new is ${pts.to_string(pipeline.targetSize)}`);
        pipeline.target.setSize(pipeline.targetSize[0], pipeline.targetSize[1]);
        pipeline.targetMask.setSize(pipeline.targetSize[0], pipeline.targetSize[1]);
        pipeline.plane = new THREE.PlaneGeometry(pipeline.targetSize[0], pipeline.targetSize[1]);
        if (pipeline.quadPost)
            pipeline.quadPost.geometry = pipeline.plane;
        const cameraMode = 0;
        if (cameraMode) {
            pipeline.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
            //camera.zoom = camera.aspect; // scales "to fit" rather than zooming out
            pipeline.camera.position.z = 800;
        }
        else {
            pipeline.camera = make_orthographic_camera(pipeline.targetSize[0], pipeline.targetSize[1]);
        }
        pipeline.camera2 = make_orthographic_camera(pipeline.targetSize[0], pipeline.targetSize[1]);
        pipeline.camera2.updateProjectionMatrix();
        pipeline.renderer.setSize(pipeline.screenSize[0], pipeline.screenSize[1]);
    }
    let mem = [];
    function load_texture(file, mode = 1, cb, key) {
        if (mem[key || file])
            return mem[key || file];
        let texture = new THREE.TextureLoader().load(file + `?v=${app.feed}`, cb);
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
    pipeline.load_texture = load_texture;
    function make_render_target(w, h) {
        const o = {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat
        };
        let target = new THREE.WebGLRenderTarget(w, h, o);
        return target;
    }
    pipeline.make_render_target = make_render_target;
    function make_orthographic_camera(w, h) {
        let camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, -100, 100);
        camera.updateProjectionMatrix();
        return camera;
    }
    pipeline.make_orthographic_camera = make_orthographic_camera;
    function erase_children(group) {
        while (group.children.length > 0)
            group.remove(group.children[0]);
    }
    pipeline.erase_children = erase_children;
})(pipeline || (pipeline = {}));
export default pipeline;
