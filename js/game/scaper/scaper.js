/// This poorly named component turns basic models into tiles
//  for further use in pipeline.ts
var scaper;
(function (scaper) {
    function init() {
        scaper.scene = new THREE.Scene();
        scaper.renderer = new THREE.WebGLRenderer({
            antialias: false,
            // premultipliedAlpha: false
        });
    }
    scaper.init = init;
})(scaper || (scaper = {}));
export default scaper;
