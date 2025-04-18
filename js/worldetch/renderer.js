import app from '../app.js';
import glob from '../dep/glob.js';
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
var renderer;
(function (renderer_1) {
    renderer_1.cameraMode = 'ortho';
    // Used for render target size
    renderer_1.DOTS_PER_INCH_CORRECTED_RENDER_TARGET = true;
    // Superior 
    renderer_1.ROUND_UP_DOTS_PER_INCH = true;
    // Used for dithering
    renderer_1.USE_EXTRA_RENDER_TARGET = true;
    renderer_1.dithering = true;
    renderer_1.compression = false;
    let groups;
    (function (groups) {
    })(groups = renderer_1.groups || (renderer_1.groups = {}));
    function render() {
        if (app.key('z') == 1)
            renderer_1.material2.uniforms.compression.value = renderer_1.compression = !renderer_1.compression;
        if (app.key('d') == 1)
            renderer_1.material2.uniforms.dithering.value = renderer_1.dithering = !renderer_1.dithering;
        //renderer.setRenderTarget(targetMask);
        //renderer.clear();
        //renderer.render(sceneMask, camera);
        renderer_1.renderer.setRenderTarget(renderer_1.target);
        renderer_1.renderer.clear();
        renderer_1.renderer.render(renderer_1.scene, renderer_1.camera);
        // Again, used by dither
        if (renderer_1.USE_EXTRA_RENDER_TARGET) {
            renderer_1.camera2.scale.set(1 / 2, 1 / 2, 1 / 2);
            renderer_1.camera2.updateMatrix();
            renderer_1.renderer.setRenderTarget(renderer_1.target2);
        }
        else {
            renderer_1.renderer.setRenderTarget(null);
        }
        renderer_1.renderer.clear();
        renderer_1.renderer.render(renderer_1.scene2, renderer_1.camera2);
        if (renderer_1.USE_EXTRA_RENDER_TARGET) {
            // Great, for dither
            renderer_1.renderer.setRenderTarget(null);
            renderer_1.renderer.clear();
            renderer_1.renderer.render(renderer_1.scene3, renderer_1.camera3);
        }
    }
    renderer_1.render = render;
    function purge() {
        onWindowResize();
    }
    renderer_1.purge = purge;
    function init() {
        console.log('pipeline init');
        THREE.ColorManagement.enabled = false;
        THREE.Object3D.DEFAULT_MATRIX_AUTO_UPDATE = true;
        THREE.Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = true;
        groups.camera = new THREE.Group;
        groups.sprites = new THREE.Group;
        groups.sprites.visible = false;
        groups.sprites.frustumCulled = false;
        groups.monolith = new THREE.Group;
        renderer_1.scene = new THREE.Scene();
        renderer_1.scene.frustumCulled = false;
        renderer_1.scene.add(groups.camera);
        renderer_1.scene.add(groups.sprites);
        renderer_1.scene.add(groups.monolith);
        // scene.add(new THREE.AxesHelper(100));
        renderer_1.scene.background = new THREE.Color('#333');
        renderer_1.ambientLight = new THREE.AmbientLight('white', Math.PI / 2);
        renderer_1.scene.add(renderer_1.ambientLight);
        renderer_1.scene2 = new THREE.Scene();
        renderer_1.scene2.frustumCulled = false;
        renderer_1.scene2.background = new THREE.Color('green');
        renderer_1.scene2.add(new THREE.AmbientLight('white', Math.PI / 1));
        renderer_1.scene3 = new THREE.Scene();
        renderer_1.scene3.frustumCulled = false;
        renderer_1.scene3.background = new THREE.Color('purple');
        renderer_1.scene3.add(new THREE.AmbientLight('white', Math.PI / 1));
        renderer_1.sceneMask = new THREE.Scene();
        renderer_1.sceneMask.add(new THREE.AmbientLight('white', Math.PI / 1));
        if (renderer_1.DOTS_PER_INCH_CORRECTED_RENDER_TARGET) {
            glob.dots_per_inch = window.devicePixelRatio;
            if (renderer_1.ROUND_UP_DOTS_PER_INCH)
                glob.dots_per_inch = Math.ceil(glob.dots_per_inch);
        }
        renderer_1.target = new THREE.WebGLRenderTarget(1024, 1024, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            colorSpace: THREE.NoColorSpace,
            generateMipmaps: false,
        });
        if (renderer_1.USE_EXTRA_RENDER_TARGET) {
            renderer_1.target2 = renderer_1.target.clone();
        }
        renderer_1.targetMask = renderer_1.target.clone();
        renderer_1.renderer = new THREE.WebGLRenderer({
            antialias: false,
            // premultipliedAlpha: false
        });
        glob.renderer = renderer_1.renderer;
        renderer_1.renderer.setPixelRatio(glob.dots_per_inch);
        renderer_1.renderer.setSize(100, 100);
        renderer_1.renderer.setClearColor(0xffffff, 0);
        renderer_1.renderer.autoClear = true;
        renderer_1.renderer.toneMapping = THREE.NoToneMapping;
        //renderer.outputColorSpace = THREE.SRGBColorSpace;
        //renderer.setClearAlpha(1.0);
        document.body.appendChild(renderer_1.renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
        window.pipeline = renderer_1.renderer;
        onWindowResize();
    }
    renderer_1.init = init;
    renderer_1.screenSize = [0, 0];
    renderer_1.targetSize = [0, 0];
    function onWindowResize() {
        renderer_1.screenSize = [window.innerWidth, window.innerHeight];
        renderer_1.screenSize = (pts.floor(renderer_1.screenSize));
        //screenSize = pts.even(screenSize, -1);
        renderer_1.targetSize = (pts.copy(renderer_1.screenSize));
        if (renderer_1.DOTS_PER_INCH_CORRECTED_RENDER_TARGET) {
            renderer_1.targetSize = (pts.mult(renderer_1.screenSize, glob.dots_per_inch));
            renderer_1.targetSize = (pts.floor(renderer_1.targetSize));
            // targetSize = pts.make_uneven(targetSize, -1);
        }
        renderer_1.renderer.setSize(renderer_1.screenSize[0], renderer_1.screenSize[1]);
        console.log(`
		window inner ${pts.to_string(renderer_1.screenSize)}\n
		      new is ${pts.to_string(renderer_1.targetSize)}`);
        renderer_1.target.setSize(renderer_1.targetSize[0], renderer_1.targetSize[1]);
        renderer_1.targetMask.setSize(renderer_1.targetSize[0], renderer_1.targetSize[1]);
        if (renderer_1.USE_EXTRA_RENDER_TARGET)
            renderer_1.target2.setSize(renderer_1.targetSize[0], renderer_1.targetSize[1]);
        renderer_1.plane?.dispose();
        renderer_1.plane = new THREE.PlaneGeometry(renderer_1.targetSize[0], renderer_1.targetSize[1]);
        renderer_1.material2?.dispose();
        renderer_1.material2 = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: renderer_1.target.texture },
                compression: { value: renderer_1.compression },
                dithering: { value: renderer_1.dithering }
            },
            vertexShader: vertexScreen,
            fragmentShader: fragment2,
            depthTest: false,
            depthWrite: false
        });
        renderer_1.quad2 = new THREE.Mesh(renderer_1.plane, renderer_1.material2);
        while (renderer_1.scene2.children.length > 0)
            renderer_1.scene2.remove(renderer_1.scene2.children[0]);
        renderer_1.scene2.add(renderer_1.quad2);
        if (renderer_1.USE_EXTRA_RENDER_TARGET) {
            renderer_1.material3?.dispose();
            renderer_1.material3 = new THREE.ShaderMaterial({
                uniforms: {
                    tDiffuse: { value: renderer_1.target2.texture },
                },
                vertexShader: vertexScreen,
                fragmentShader: fragment3,
                depthTest: false,
                depthWrite: false
            });
            renderer_1.quad3 = new THREE.Mesh(renderer_1.plane, renderer_1.material3);
            while (renderer_1.scene3.children.length > 0)
                renderer_1.scene3.remove(renderer_1.scene3.children[0]);
            renderer_1.scene3.add(renderer_1.quad3);
        }
        while (groups.camera.children.length > 0)
            groups.camera.remove(groups.camera.children[0]);
        if (renderer_1.cameraMode == 'perspective') {
            renderer_1.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer_1.camera.position.z = 200;
            renderer_1.camera.updateMatrix();
            groups.camera.rotation.x = Math.PI / 12;
            groups.camera.add(renderer_1.camera);
            groups.camera.updateMatrix();
        }
        else {
            renderer_1.camera = makeOrthographicCamera(renderer_1.targetSize[0], renderer_1.targetSize[1]);
            groups.camera.add(renderer_1.camera);
            groups.camera.add(new THREE.AxesHelper(20));
            //groups.camera.rotation.x = glob.magiccamerarotation;
            renderer_1.camera.rotation.x = glob.magiccamerarotation;
        }
        renderer_1.camera.updateMatrix();
        renderer_1.camera.updateProjectionMatrix();
        renderer_1.camera2 = makeOrthographicCamera(renderer_1.targetSize[0], renderer_1.targetSize[1]);
        renderer_1.camera2.updateProjectionMatrix();
        renderer_1.camera3 = makeOrthographicCamera(renderer_1.targetSize[0], renderer_1.targetSize[1]);
        renderer_1.camera3.updateProjectionMatrix();
    }
    let mem = [];
    async function preloadTextureAsync(file, mode = 'nearest') {
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
    renderer_1.preloadTextureAsync = preloadTextureAsync;
    function getTexture(file) {
        return mem[file];
    }
    renderer_1.getTexture = getTexture;
    function makeRenderTarget(width, height) {
        return new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            colorSpace: THREE.NoColorSpace,
            generateMipmaps: false,
        });
    }
    renderer_1.makeRenderTarget = makeRenderTarget;
    function makeOrthographicCamera(w, h) {
        let camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, -500, 500);
        camera.updateProjectionMatrix();
        return camera;
    }
    renderer_1.makeOrthographicCamera = makeOrthographicCamera;
    function utilEraseChildren(group) {
        while (group.children.length > 0)
            group.remove(group.children[0]);
    }
    renderer_1.utilEraseChildren = utilEraseChildren;
})(renderer || (renderer = {}));
export default renderer;
