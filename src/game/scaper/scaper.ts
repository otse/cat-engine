/// This poorly named component turns basic models into tiles
//  for further use in pipeline.ts

namespace scaper {
	export var scene
	export var camera
	export var renderer
	export var ambientLight

    export function init() {
		scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer({
			antialias: false,
			// premultipliedAlpha: false
		});
    }
}

export default scaper;