import pts from "../dep/pts.js";
import pipeline from "./pipeline.js";
import glob from "./../dep/glob.js";
;
;
// A sprite uses a per-material UV transform
// Needs "cleaning"
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
            spriteSize: glob.hexsize,
            spriteImage: 'hex/tile.png',
            spriteColor: 'white',
            ...data,
        };
        // Make uneven ceil fixes most misaligments
        this.data.spriteSize = (pts.make_uneven(this.data.spriteSize, 1));
        this.gobj = this.data.gobj;
        this.gobj.sprite = this;
        // this.data.spriteColor = this.gobj.data.colorOverride || 'white';
        if (glob.randomspritecolor)
            this.data.spriteColor = glob.sample(['purple', 'magenta', 'cyan', 'wheat', 'pink', 'salmon']);
        this.matrix = new THREE.Matrix3;
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
    _step() { }
    _delete() {
        // Mono doesn't delete
        return;
        this.mesh.parent.remove(this.mesh);
        this.gobj.sprite = undefined;
    }
    _create() {
        let defines = {};
        // defines.MASKED = 1;
        // Monolith uses real geometry
        return;
        this.material = SpriteMaterial({
            map: pipeline.getTexture('./img/' + this.data.spriteImage),
            color: this.data.spriteColor,
            transparent: true,
            depthTest: false,
            // side: THREE.DoubleSide
        }, {
            matrix: this.matrix,
            maskColor: new THREE.Vector3(1, 1, 1),
            masked: false,
            bool: true
        }, defines);
        let { spriteSize } = this.data;
        spriteSize = (pts.mult(spriteSize, glob.scale));
        this.geometry = new THREE.PlaneGeometry(spriteSize[0], spriteSize[1], 1, 1);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.update();
        pipeline.groups.sprites.add(this.mesh);
    }
    update() {
        return;
        const { gobj: gabe } = this;
        this.material.color.set(this.data.spriteColor);
        //console.log('no color?', this.data.color);
        this.mesh.renderOrder = -gabe.wpos[1] + gabe.wpos[0];
        let pos = pts.copy(gabe.rpos);
        // Todo the problem here was that aligning the bottom
        // resulted in impossible problems
        const tileSize = glob.hexsize;
        // Todo omg
        if (this.data.bottomSort)
            pos[1] += this.data.spriteSize[1] / 2;
        //let pos = pts.add(this.gabeObject.rpos, pts.divide(this.data.size!, 2));
        this.mesh.position.fromArray([...pos, gabe.z]);
        this.mesh.updateMatrix();
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
