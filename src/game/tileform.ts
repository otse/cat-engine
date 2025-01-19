/// This poorly named component turns basic meshes into sprites

import glob from "../dep/glob.js";
import pipeline from "./pipeline.js";
import sprite3d from "./sprite 3d.js";
import sprite from "./sprite.js";

namespace tileform {

	export async function init() {
		await stage.init();
		return;
	}

	export namespace stage {
		export let scene, group, camera, renderer, ambient, sun
		export let spotlight: sprite3d | undefined
	}

	export namespace stage {

		export async function init() {
			await preload();
			await boot();
		}

		async function preload() {
			await pipeline.loadTextureAsync('./img/textures/stonemixed.jpg');
		}

		async function boot() {
			scene = new THREE.Scene();
			// scene.background = new THREE.Color('purple');
			scene.rotation.set(Math.PI / 6, Math.PI / Math.PI, 0);
			camera = new THREE.OrthographicCamera(100 / - 2, 100 / 2, 100 / 2, 100 / - 2, -100, 100);
			group = new THREE.Group();
			group.rotation.set(-Math.PI / 2, 0, 0);
			group.updateMatrix();
			scene.add(group);
			scene.updateMatrix();
			ambient = new THREE.AmbientLight('white', 1);
			scene.add(ambient);
			const sunDistance = 100;
			sun = new THREE.DirectionalLight('yellow', 1);
			sun.position.set(-sunDistance, 0, sunDistance / 2);
			scene.add(sun);
			/*renderer = new THREE.WebGLRenderer({
				antialias: false,
			});
			renderer.setPixelRatio(glob);
			renderer.setSize(100, 100);
			renderer.setClearColor(0xffffff, 1);
			renderer.autoClear = true;
			renderer.toneMapping = THREE.NoToneMapping;*/
			// document.body.appendChild(renderer.domElement);
		}

		export function prepare(sprite: sprite3d) {
			spotlight = sprite;
			const size = sprite.data.size!;
			camera = new THREE.OrthographicCamera(
				size[0] / - 2,
				size[0] / 2,
				size[1] / 2,
				size[1] / - 2,
				-100, 100);
			while (group.children.length > 0)
				group.remove(group.children[0]);
			group.add(sprite.shape!.mesh);
		}

		export function render() {
			// Todo: stage renderer doesn't render anything so use default
			glob.renderer.setRenderTarget(spotlight!.target);
			glob.renderer.clear();
			glob.renderer.render(scene, camera);
			glob.renderer.setRenderTarget(null);
		}
	}
}

export default tileform;