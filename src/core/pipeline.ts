import app from '../app.js';
import glob from './../dep/glob.js';
import pts from '../dep/pts.js';

const fragmentBackdrop = `
varying vec2 vUv;
//uniform float time;
void main() {
	gl_FragColor = vec4( 0.5, 0.5, 0.5, 1.0 );
}`

const fragment2 = `
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
}`

const fragment3 = `
varying vec2 vUv;
uniform sampler2D tDiffuse;
void main() {
	vec4 clr = texture2D( tDiffuse, vUv );
	// clr.rgb = mix(clr.rgb, vec3(1.0, 0, 0), 0.5);
	gl_FragColor = clr;
}`

const vertexScreen = `
varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`

namespace pipeline {

	export const cameraMode: 'ortho' | 'perspective' = 'ortho';

	export const DOTS_PER_INCH_CORRECTED_RENDER_TARGET = true;
	export const ROUND_UP_DOTS_PER_INCH = true;

	export const USE_SCENE3 = true;

	export var dotsPerInch = 1;

	export var dithering = false;
	export var compression = true;

	export namespace groups {
		export var camera
		export var sprites
		export var monolith
	}
	export var scene
	export var scene2
	export var scene3
	export var sceneMask

	export var camera
	export var camera2
	export var camera3

	export var target
	export var target2
	export var targetMask
	export var renderer

	export var ambientLight
	export var directionalLight

	export var material2
	export var material3

	export var quad2
	export var quad3

	export function render() {

		if (app.key('z') == 1)
			material2.uniforms.compression.value = compression = !compression;
		if (app.key('d') == 1)
			material2.uniforms.dithering.value = dithering = !dithering;

		if (glob.dirtyobjects) {
			//renderer.setRenderTarget(targetMask);
			//renderer.clear();
			//renderer.render(sceneMask, camera);
			renderer.setRenderTarget(target);
			renderer.clear();
			renderer.render(scene, camera);
		}

		if (USE_SCENE3) {
			camera2.scale.set(0.5, 0.5, 0.5);
			camera2.updateMatrix();

			renderer.setRenderTarget(target2);
		}
		else {
			renderer.setRenderTarget(null);
		}
		renderer.clear();
		renderer.render(scene2, camera2);

		if (USE_SCENE3) {
			renderer.setRenderTarget(null);
			renderer.clear();
			renderer.render(scene3, camera3);
		}

		glob.dirtyobjects = false;
	}

	export var plane

	export function purge() {
		onWindowResize();
	}

	export function init() {
		console.log('pipeline init')

		glob.dirtyobjects = true;

		THREE.ColorManagement.enabled = false;
		THREE.Object3D.DEFAULT_MATRIX_AUTO_UPDATE = true;
		THREE.Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = true;

		groups.camera = new THREE.Group;
		groups.sprites = new THREE.Group;
		groups.sprites.visible = false;
		groups.sprites.frustumCulled = false;
		groups.monolith = new THREE.Group;

		scene = new THREE.Scene();
		scene.frustumCulled = false;
		scene.add(groups.camera);
		scene.add(groups.sprites);
		scene.add(groups.monolith);
		// scene.add(new THREE.AxesHelper(100));
		scene.background = new THREE.Color('#999');

		ambientLight = new THREE.AmbientLight('white', Math.PI / 1);
		scene.add(ambientLight);

		scene2 = new THREE.Scene();
		scene2.frustumCulled = false;1
		scene2.background = new THREE.Color('green');
		scene2.add(new THREE.AmbientLight('white', Math.PI / 1));

		scene3 = new THREE.Scene();
		scene3.frustumCulled = false;
		scene3.background = new THREE.Color('purple');
		scene3.add(new THREE.AmbientLight('white', Math.PI / 1));

		sceneMask = new THREE.Scene();
		sceneMask.add(new THREE.AmbientLight('white', Math.PI / 1));

		

		if (DOTS_PER_INCH_CORRECTED_RENDER_TARGET) {
			dotsPerInch = window.devicePixelRatio;
			if (ROUND_UP_DOTS_PER_INCH)
				dotsPerInch = Math.ceil(dotsPerInch);
		}

		glob.dotsPerInch = dotsPerInch;

		target = new THREE.WebGLRenderTarget(1024, 1024, {
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat,
			colorSpace: THREE.NoColorSpace,
			generateMipmaps: false,
		});
		if (USE_SCENE3) {
			target2 = target.clone();
		}
		targetMask = target.clone();

		renderer = new THREE.WebGLRenderer({
			antialias: false,
			// premultipliedAlpha: false
		});
		glob.renderer = renderer;
		renderer.setPixelRatio(dotsPerInch);
		renderer.setSize(100, 100);
		renderer.setClearColor(0xffffff, 0);
		renderer.autoClear = true;
		renderer.toneMapping = THREE.NoToneMapping;
		//renderer.outputColorSpace = THREE.SRGBColorSpace;
		//renderer.setClearAlpha(1.0);

		document.body.appendChild(renderer.domElement);

		window.addEventListener('resize', onWindowResize, false);
		(window as any).pipeline = pipeline;


		onWindowResize();
	}

	export var screenSize: vec2 = [0, 0];
	export var targetSize: vec2 = [0, 0];

	function onWindowResize() {
		screenSize = [window.innerWidth, window.innerHeight];
		screenSize = (pts.floor(screenSize));
		//screenSize = pts.even(screenSize, -1);
		targetSize = (pts.copy(screenSize));

		if (DOTS_PER_INCH_CORRECTED_RENDER_TARGET) {
			targetSize = (pts.mult(screenSize, dotsPerInch));
			targetSize = (pts.floor(targetSize));
			// targetSize = pts.make_uneven(targetSize, -1);
		}
		renderer.setSize(screenSize[0], screenSize[1]);

		console.log(`
		window inner ${pts.to_string(screenSize)}\n
		      new is ${pts.to_string(targetSize)}`);

		target.setSize(targetSize[0], targetSize[1]);
		targetMask.setSize(targetSize[0], targetSize[1]);
		if (USE_SCENE3)
			target2.setSize(targetSize[0], targetSize[1]);

		plane?.dispose();
		plane = new THREE.PlaneGeometry(targetSize[0], targetSize[1]);

		glob.dirtyobjects = true;

		material2?.dispose();
		material2 = new THREE.ShaderMaterial({
			uniforms: {
				tDiffuse: { value: target.texture },
				compression: { value: compression },
				dithering: { value: dithering }
			},
			vertexShader: vertexScreen,
			fragmentShader: fragment2,
			depthTest: false,
			depthWrite: false
		});
		quad2 = new THREE.Mesh(plane, material2);
		while (scene2.children.length > 0)
			scene2.remove(scene2.children[0]);
		scene2.add(quad2);

		if (USE_SCENE3) {
			material3?.dispose();
			material3 = new THREE.ShaderMaterial({
				uniforms: {
					tDiffuse: { value: target2.texture },
				},
				vertexShader: vertexScreen,
				fragmentShader: fragment3,
				depthTest: false,
				depthWrite: false
			});
			quad3 = new THREE.Mesh(plane, material3);
			while (scene3.children.length > 0)
				scene3.remove(scene3.children[0]);
			scene3.add(quad3);
		}

		while (groups.camera.children.length > 0)
			groups.camera.remove(groups.camera.children[0]);

		if (cameraMode == 'perspective') {
			camera = new THREE.PerspectiveCamera(
				45, window.innerWidth / window.innerHeight, 0.1, 1000);
			camera.position.z = 200;
			camera.updateMatrix();
			groups.camera.rotation.x = Math.PI / 12;
			groups.camera.add(camera);
			groups.camera.updateMatrix();
		}
		else {
			camera = makeOrthographicCamera(targetSize[0], targetSize[1]);
			groups.camera.add(camera);
			groups.camera.add(new THREE.AxesHelper(20));
			//groups.camera.rotation.x = glob.camerarotationx;
			camera.rotation.x = glob.camerarotationx;
		}
		camera.updateMatrix();
		camera.updateProjectionMatrix();

		camera2 = makeOrthographicCamera(targetSize[0], targetSize[1]);
		camera2.updateProjectionMatrix();

		camera3 = makeOrthographicCamera(targetSize[0], targetSize[1]);
		camera3.updateProjectionMatrix();
	}

	let mem = []

	export async function preloadTextureAsync(file: string, mode: 'nearest' | 'linear' = 'linear') {
		let texture = await new THREE.TextureLoader().loadAsync(file + `?v=${app.feed}`);
		mem[file] = texture;
		texture.generateMipmaps = false;
		texture.center.set(0, 1);
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		if (mode === 'linear') {
			texture.magFilter = THREE.LinearFilter;
			texture.minFilter = THREE.LinearFilter;
		}
		else if (mode === 'nearest') {
			texture.magFilter = THREE.NearestFilter;
			texture.minFilter = THREE.NearestFilter;
		}
	}

	export function getTexture(file: string) {
		return mem[file];
	}

	export function makeRenderTarget(width, height) {
		return new THREE.WebGLRenderTarget(width, height, {
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat,
			colorSpace: THREE.NoColorSpace,
			generateMipmaps: false,
		});
	}

	export function makeOrthographicCamera(w, h) {
		let camera = new THREE.OrthographicCamera(w / - 2, w / 2, h / 2, h / - 2, -200, 200);
		camera.updateProjectionMatrix();
		return camera;
	}

	export function utilEraseChildren(group) {
		while (group.children.length > 0)
			group.remove(group.children[0]);
	}
}

export default pipeline;