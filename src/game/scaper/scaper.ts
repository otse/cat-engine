/// This poorly named component turns basic models into tiles
//  for further use in pipeline.ts

import pipeline from "../pipeline.js";
import sprite from "../sprite.js";

/*
bit of a rant
consider a game that uses an isometric 3d projection
*/
namespace scaper {
	export var scene, group, camera, target, renderer
	export var ambient, sun

	export async function init() {
		const box = new THREE.BoxGeometry(10, 10, 10);
		const material = new THREE.MeshPhongMaterial({ color: 'red' });
		const mesh = new THREE.Mesh(box, material);
		pipeline.scene.add(mesh);
		return boot();
	}

	async function boot() {
		const size = [24, 40];

		scene = new THREE.Scene();
		group = new THREE.Group();
		target = pipeline.make_render_target(size[0], size[1]);
		camera = pipeline.make_orthographic_camera(size[0], size[1]);

		scene.rotation.set(Math.PI / 6, Math.PI / 4, 0);
		group.rotation.set(-Math.PI / 2, 0, 0);

		ambient = new THREE.AmbientLight('#777');
		scene.add(ambient);

		const size2 = 100;
		sun = new THREE.DirectionalLight(0xffffff, 0.25);
		sun.position.set(-size2, 0, size2 / 2);

		renderer = new THREE.WebGLRenderer({
			antialias: false,
			// premultipliedAlpha: false
		});
	}

	export function take(model: modelsprite) {
		pipeline.erase_children(group);

		// material.map = this.target.texture;

	}
	export function render() {
		renderer.setRenderTarget(target);
		renderer.clear();
		renderer.render(scene, camera);
	}

	class model {

	}

	class modelsprite extends sprite {
		target
		constructor(data: sprite.params, protected readonly model: model) {
			super(data);
			this.basic();
		}
		basic() {
			this.target = pipeline.make_render_target(this.data.size![0], this.data.size![1]);
		}
		render() {
			scaper.take(this);
			scaper.render();
		}
	}
}

export default scaper;