import app from '../app.js';
import pts from '../dep/pts.js';

const fragmentBackdrop = `
varying vec2 vUv;
//uniform float time;
void main() {
	gl_FragColor = vec4( 0.5, 0.5, 0.5, 1.0 );
}`

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
}`


const vertexScreen = `
varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`

namespace pipeline {

	export const DOTS_PER_INCH_CORRECTED_RENDER_TARGET = true;

	export var dotsPerInch = 1;

	export namespace groups {
		export var major
	}
	export var scene
	export var sceneShader
	export var sceneMask

	export var camera
	export var camera2

	export var target
	export var targetMask
	export var renderer

	export var ambientLight
	export var directionalLight

	export var materialBg
	export var materialPost

	export var quadPost

	export function render() {

		const allowColorDepthToggle = true;

		if (allowColorDepthToggle)
			if (app.key('z') == 1)
				materialPost.uniforms.compression.value = !materialPost.uniforms.compression.value;

		renderer.setRenderTarget(targetMask);
		renderer.clear();
		renderer.render(sceneMask, camera);

		renderer.setRenderTarget(target);
		renderer.clear();
		renderer.render(scene, camera);

		renderer.setRenderTarget(null);
		renderer.clear();
		renderer.render(sceneShader, camera2);
	}

	export var plane

	export function init() {
		console.log('pipeline init')

		THREE.ColorManagement.enabled = false;
		THREE.Object3D.DefaultMatrixAutoUpdate = false;

		groups.major = new THREE.Group;
		groups.major.frustumCulled = false;
		groups.major.matrixAutoUpdate = false;
		groups.major.matrixWorldAutoUpdate = false;

		scene = new THREE.Scene();
		scene.frustumCulled = false;
		scene.add(groups.major);
		scene.background = new THREE.Color('purple');
		sceneShader = new THREE.Scene();
		sceneShader.frustumCulled = false;
		sceneShader.background = new THREE.Color('red');

		sceneMask = new THREE.Scene();
		sceneMask.add(new THREE.AmbientLight(0xffffff, 1));

		ambientLight = new THREE.AmbientLight(0xffffff, 1);
		scene.add(ambientLight);

		if (DOTS_PER_INCH_CORRECTED_RENDER_TARGET) {
			dotsPerInch = window.devicePixelRatio;
		}

		target = new THREE.WebGLRenderTarget(1024, 1024, {
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat
		});
		targetMask = target.clone();

		renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setPixelRatio(dotsPerInch);
		renderer.setSize(100, 100);
		renderer.setClearColor(0xffffff, 0);
		renderer.autoClear = true;
		// renderer.outputColorSpace = THREE.NoColorSpace;
		//renderer.setClearAlpha(1.0);

		document.body.appendChild(renderer.domElement);

		window.addEventListener('resize', onWindowResize, false);

		materialPost = new THREE.ShaderMaterial({
			uniforms: {
				tDiffuse: { value: target.texture },
				compression: { value: 1 }
			},
			vertexShader: vertexScreen,
			fragmentShader: fragmentPost,
			depthWrite: false
		});
		onWindowResize();
		quadPost = new THREE.Mesh(plane, materialPost);
		sceneShader.add(quadPost);
		(window as any).pipeline = pipeline;
	}

	export var screenSize: vec2 = [0, 0];
	export var targetSize: vec2 = [0, 0];

	function onWindowResize() {
		screenSize = [window.innerWidth, window.innerHeight];
		screenSize = pts.floor(screenSize);
		targetSize = pts.copy(screenSize);
		if (DOTS_PER_INCH_CORRECTED_RENDER_TARGET) {
			targetSize = pts.mult(screenSize, dotsPerInch);
			targetSize = pts.floor(targetSize);
			targetSize = pts.even(targetSize, -1);
		}
		console.log(`
		window inner ${pts.to_string(screenSize)}\n
		      new is ${pts.to_string(targetSize)}`);

		target.setSize(targetSize[0], targetSize[1]);
		targetMask.setSize(targetSize[0], targetSize[1]);

		plane = new THREE.PlaneGeometry(targetSize[0], targetSize[1]);

		if (quadPost)
			quadPost.geometry = plane;

		const cameraMode = 0;

		if (cameraMode) {
			camera = new THREE.PerspectiveCamera(
				70, window.innerWidth / window.innerHeight, 1, 1000);
			//camera.zoom = camera.aspect; // scales "to fit" rather than zooming out
			camera.position.z = 800;
		}
		else {
			camera = make_orthographic_camera(targetSize[0], targetSize[1]);
		}

		camera2 = make_orthographic_camera(targetSize[0], targetSize[1]);
		camera2.updateProjectionMatrix();
		renderer.setSize(screenSize[0], screenSize[1]);
	}

	let mem = []

	export function load_texture(file: string, mode = 1, cb?, key?: string) {
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

	export function make_render_target(w, h) {
		const o = {
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat
		};
		let target = new THREE.WebGLRenderTarget(w, h, o);
		return target;
	}

	export function make_orthographic_camera(w, h) {
		let camera = new THREE.OrthographicCamera(w / - 2, w / 2, h / 2, h / - 2, -100, 100);
		camera.updateProjectionMatrix();
		return camera;
	}

	export function erase_children(group) {
		while (group.children.length > 0)
			group.remove(group.children[0]);
	}
}

export default pipeline;