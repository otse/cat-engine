import app from '../app.js';
import glob from './../dep/glob.js';
import pts from '../dep/pts.js';
const fragmentBackdrop = `
varying vec2 vUv;
//uniform float time;
void main() {
	gl_FragColor = vec4( 0.5, 0.5, 0.5, 1.0 );
}`;
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
}`;
const fragment3 = `
varying vec2 vUv;
uniform sampler2D tDiffuse;
void main() {
	vec4 clr = texture2D( tDiffuse, vUv );
	// clr.rgb = mix(clr.rgb, vec3(1.0, 0, 0), 0.5);
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
    pipeline.cameraMode = 'ortho';
    pipeline.DOTS_PER_INCH_CORRECTED_RENDER_TARGET = true;
    pipeline.ROUND_UP_DOTS_PER_INCH = true;
    pipeline.USE_SCENE3 = true;
    pipeline.dotsPerInch = 1;
    pipeline.dithering = false;
    pipeline.compression = true;
    let groups;
    (function (groups) {
    })(groups = pipeline.groups || (pipeline.groups = {}));
    function render() {
        if (app.key('z') == 1)
            pipeline.material2.uniforms.compression.value = pipeline.compression = !pipeline.compression;
        if (app.key('d') == 1)
            pipeline.material2.uniforms.dithering.value = pipeline.dithering = !pipeline.dithering;
        if (glob.dirtyObjects) {
            //renderer.setRenderTarget(targetMask);
            //renderer.clear();
            //renderer.render(sceneMask, camera);
            pipeline.renderer.setRenderTarget(pipeline.target);
            pipeline.renderer.clear();
            pipeline.renderer.render(pipeline.scene, pipeline.camera);
        }
        if (pipeline.USE_SCENE3) {
            pipeline.camera2.scale.set(0.5, 0.5, 0.5);
            pipeline.camera2.updateMatrix();
            pipeline.renderer.setRenderTarget(pipeline.target2);
        }
        else {
            pipeline.renderer.setRenderTarget(null);
        }
        pipeline.renderer.clear();
        pipeline.renderer.render(pipeline.scene2, pipeline.camera2);
        if (pipeline.USE_SCENE3) {
            pipeline.renderer.setRenderTarget(null);
            pipeline.renderer.clear();
            pipeline.renderer.render(pipeline.scene3, pipeline.camera3);
        }
        glob.dirtyObjects = false;
    }
    pipeline.render = render;
    function init() {
        console.log('pipeline init');
        glob.dirtyObjects = true;
        THREE.ColorManagement.enabled = false;
        THREE.Object3D.DEFAULT_MATRIX_AUTO_UPDATE = false;
        THREE.Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = true;
        groups.camera = new THREE.Group;
        groups.major = new THREE.Group;
        groups.major.frustumCulled = false;
        pipeline.scene = new THREE.Scene();
        pipeline.scene.frustumCulled = false;
        pipeline.scene.add(groups.camera);
        pipeline.scene.add(groups.major);
        // scene.add(new THREE.AxesHelper(100));
        pipeline.scene.background = new THREE.Color('#333');
        pipeline.scene2 = new THREE.Scene();
        pipeline.scene2.frustumCulled = false;
        pipeline.scene2.background = new THREE.Color('green');
        pipeline.scene2.add(new THREE.AmbientLight('white', Math.PI / 1));
        pipeline.scene3 = new THREE.Scene();
        pipeline.scene3.frustumCulled = false;
        pipeline.scene3.background = new THREE.Color('purple');
        pipeline.scene3.add(new THREE.AmbientLight('white', Math.PI / 1));
        pipeline.sceneMask = new THREE.Scene();
        pipeline.sceneMask.add(new THREE.AmbientLight('white', Math.PI / 1));
        pipeline.ambientLight = new THREE.AmbientLight('white', Math.PI / 1);
        pipeline.scene.add(pipeline.ambientLight);
        if (pipeline.DOTS_PER_INCH_CORRECTED_RENDER_TARGET) {
            pipeline.dotsPerInch = window.devicePixelRatio;
            if (pipeline.ROUND_UP_DOTS_PER_INCH)
                pipeline.dotsPerInch = Math.ceil(pipeline.dotsPerInch);
        }
        glob.dotsPerInch = pipeline.dotsPerInch;
        pipeline.target = new THREE.WebGLRenderTarget(1024, 1024, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            colorSpace: THREE.NoColorSpace,
            generateMipmaps: false,
        });
        if (pipeline.USE_SCENE3) {
            pipeline.target2 = pipeline.target.clone();
        }
        pipeline.targetMask = pipeline.target.clone();
        pipeline.renderer = new THREE.WebGLRenderer({
            antialias: false,
            // premultipliedAlpha: false
        });
        glob.renderer = pipeline.renderer;
        pipeline.renderer.setPixelRatio(pipeline.dotsPerInch);
        pipeline.renderer.setSize(100, 100);
        pipeline.renderer.setClearColor(0xffffff, 0);
        pipeline.renderer.autoClear = true;
        pipeline.renderer.toneMapping = THREE.NoToneMapping;
        //renderer.outputColorSpace = THREE.SRGBColorSpace;
        //renderer.setClearAlpha(1.0);
        document.body.appendChild(pipeline.renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
        window.pipeline = pipeline;
        onWindowResize();
    }
    pipeline.init = init;
    pipeline.screenSize = [0, 0];
    pipeline.targetSize = [0, 0];
    function onWindowResize() {
        pipeline.screenSize = [window.innerWidth, window.innerHeight];
        pipeline.screenSize = (pts.floor(pipeline.screenSize));
        //screenSize = pts.even(screenSize, -1);
        pipeline.targetSize = (pts.copy(pipeline.screenSize));
        if (pipeline.DOTS_PER_INCH_CORRECTED_RENDER_TARGET) {
            pipeline.targetSize = (pts.mult(pipeline.screenSize, pipeline.dotsPerInch));
            pipeline.targetSize = (pts.floor(pipeline.targetSize));
            // targetSize = pts.make_uneven(targetSize, -1);
        }
        pipeline.renderer.setSize(pipeline.screenSize[0], pipeline.screenSize[1]);
        console.log(`
		window inner ${pts.to_string(pipeline.screenSize)}\n
		      new is ${pts.to_string(pipeline.targetSize)}`);
        pipeline.target.setSize(pipeline.targetSize[0], pipeline.targetSize[1]);
        pipeline.target2?.setSize(pipeline.targetSize[0], pipeline.targetSize[1]);
        pipeline.targetMask.setSize(pipeline.targetSize[0], pipeline.targetSize[1]);
        pipeline.plane?.dispose();
        pipeline.plane = new THREE.PlaneGeometry(pipeline.targetSize[0], pipeline.targetSize[1]);
        glob.dirtyObjects = true;
        pipeline.material2?.dispose();
        pipeline.material2 = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: pipeline.target.texture },
                compression: { value: pipeline.compression },
                dithering: { value: pipeline.dithering }
            },
            vertexShader: vertexScreen,
            fragmentShader: fragment2,
            depthTest: false,
            depthWrite: false
        });
        pipeline.quad2 = new THREE.Mesh(pipeline.plane, pipeline.material2);
        pipeline.scene2.add(pipeline.quad2);
        if (pipeline.USE_SCENE3) {
            pipeline.material3?.dispose();
            pipeline.material3 = new THREE.ShaderMaterial({
                uniforms: {
                    tDiffuse: { value: pipeline.target2.texture },
                },
                vertexShader: vertexScreen,
                fragmentShader: fragment3,
                depthTest: false,
                depthWrite: false
            });
            pipeline.quad3 = new THREE.Mesh(pipeline.plane, pipeline.material3);
            pipeline.scene3.add(pipeline.quad3);
        }
        while (groups.camera.children.length > 0)
            groups.camera.remove(groups.camera.children[0]);
        if (pipeline.cameraMode == 'perspective') {
            pipeline.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            pipeline.camera.position.z = 200;
            pipeline.camera.updateMatrix();
            groups.camera.rotation.x = Math.PI / 12;
            groups.camera.add(pipeline.camera);
            groups.camera.updateMatrix();
        }
        else {
            pipeline.camera = makeOrthographicCamera(pipeline.targetSize[0], pipeline.targetSize[1]);
            groups.camera.add(pipeline.camera);
        }
        pipeline.camera.updateMatrix();
        pipeline.camera.updateProjectionMatrix();
        pipeline.camera2 = makeOrthographicCamera(pipeline.targetSize[0], pipeline.targetSize[1]);
        pipeline.camera2.updateProjectionMatrix();
        pipeline.camera3 = makeOrthographicCamera(pipeline.targetSize[0], pipeline.targetSize[1]);
        pipeline.camera3.updateProjectionMatrix();
    }
    let mem = [];
    async function preloadTextureAsync(file, mode = 'linear') {
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
    pipeline.preloadTextureAsync = preloadTextureAsync;
    function getTexture(file) {
        return mem[file];
    }
    pipeline.getTexture = getTexture;
    function makeRenderTarget(width, height) {
        return new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            colorSpace: THREE.NoColorSpace,
            generateMipmaps: false,
        });
    }
    pipeline.makeRenderTarget = makeRenderTarget;
    function makeOrthographicCamera(w, h) {
        let camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, -200, 100);
        camera.updateProjectionMatrix();
        return camera;
    }
    pipeline.makeOrthographicCamera = makeOrthographicCamera;
    function utilEraseChildren(group) {
        while (group.children.length > 0)
            group.remove(group.children[0]);
    }
    pipeline.utilEraseChildren = utilEraseChildren;
})(pipeline || (pipeline = {}));
export default pipeline;
