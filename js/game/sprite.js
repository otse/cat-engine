import pts from "../dep/pts.js";
import pipeline from "./pipeline.js";
import glob from "../dep/glob.js";
;
;
// A sprite uses a per-material UV transform
export class sprite {
    data;
    gobj;
    matrix;
    mesh;
    geometry;
    material;
    constructor(data) {
        this.data = data;
        this.data = {
            size: [17, 9],
            image: 'hex/tile.png',
            color: 'magenta',
            ...data,
        };
        this.gobj = this.data.gobj;
        this.gobj.sprite = this;
        this.data.color = this.gobj.data.colorOverride || 'white';
        this.matrix = new THREE.Matrix3;
        this.matrix.setUvTransform(0, 0, 1, 1, 0, 0, 1);
    }
    step() {
        this._step();
    }
    _step() { }
    delete() {
        this.mesh.parent.remove(this.mesh);
        this.gobj.sprite = undefined;
    }
    create() {
        this._create();
    }
    _create() {
        let defines = {};
        // defines.MASKED = 1;
        this.material = SpriteMaterial({
            map: pipeline.getTexture('./img/' + this.data.image),
            color: 'pink',
            transparent: true,
            depthTest: false,
        }, {
            matrix: this.matrix,
            maskColor: new THREE.Vector3(1, 1, 1),
            masked: false,
            bool: true
        }, defines);
        let { size } = this.data;
        size = pts.mult(size, glob.scale);
        this.geometry = new THREE.PlaneGeometry(size[0], size[1], 1, 1);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.update();
        pipeline.groups.major.add(this.mesh);
    }
    update() {
        const gabe = this.gobj;
        this.material.color.set(this.data.color);
        console.log('no color?', this.data.color);
        this.mesh.renderOrder = -gabe.wpos[1] + gabe.wpos[0];
        let pos = pts.add(gabe.rpos, pts.divide([0, this.data.size[1]], 2));
        //let pos = pts.add(this.gabeObject.rpos, pts.divide(this.data.size!, 2));
        this.mesh.position.fromArray([...pos, gabe.z]);
    }
}
;
export function SpriteMaterial(parameters, uniforms, defines = {}) {
    let material = new THREE.MeshLambertMaterial(parameters);
    material.customProgramCacheKey = function () {
        return 'romespritemat';
    };
    material.name = "romespritemat";
    material.defines = defines;
    material.onBeforeCompile = function (shader) {
        shader.uniforms.matrix = { value: uniforms.matrix };
        shader.uniforms.bool = { value: uniforms.bool };
        if (uniforms.masked) {
            shader.uniforms.tMask = { value: pipeline.targetMask.texture };
            shader.uniforms.maskColor = { value: uniforms.maskColor };
            console.log('add tmask');
        }
        shader.vertexShader = shader.vertexShader.replace(`#include <common>`, `#include <common>
			varying vec2 myPosition;
			uniform mat3 matrix;
			`);
        shader.vertexShader = shader.vertexShader.replace(`#include <worldpos_vertex>`, `#include <worldpos_vertex>
			myPosition = (projectionMatrix * mvPosition).xy / 2.0 + vec2(0.5, 0.5);
			`);
        shader.vertexShader = shader.vertexShader.replace(`#include <uv_vertex>`, `
			#ifdef USE_MAP
				vMapUv = ( matrix * vec3( uv, 1 ) ).xy;
			#endif
			`);
        shader.fragmentShader = shader.fragmentShader.replace(`#include <map_pars_fragment>`, `
			#include <map_pars_fragment>
			/*varying vec2 myPosition;
			uniform sampler2D tMask;
			uniform vec3 maskColor;
			uniform bool uniball;*/
			`);
        shader.fragmentShader = shader.fragmentShader.replace(`#include <map_fragment>`, `
			#include <map_fragment>

			/*#ifdef MASKEDx
				vec4 texelColor = texture2D( tMask, myPosition );
				texelColor.rgb = mix(texelColor.rgb, maskColor, 0.7);
				if (texelColor.a > 0.5)
				diffuseColor.rgb = texelColor.rgb;
			#endif*/
			`);
    };
    return material;
}
export default sprite;
