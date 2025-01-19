import pipeline from "./pipeline.js";
import sprite from "./sprite.js";
import tileform from "./tileform.js";
class shape_base {
    data;
    mesh;
    constructor(data) {
        this.data = data;
        this._create();
    }
    _create() { }
}
class shape_box extends shape_base {
    constructor(data) {
        super(data);
        this._create();
    }
    _create() {
        const box = new THREE.BoxGeometry(15, 20, 10);
        const material = new THREE.MeshPhongMaterial({
            color: 'red',
            map: pipeline.loadTexture(this.data.texture, 0)
        });
        const mesh = new THREE.Mesh(box, material);
        this.mesh = mesh;
    }
}
function shapeMaker(type, data) {
    let shape;
    switch (type) {
        case 'nothing':
            console.warn(' no type passed to factory ');
            break;
        case 'wall':
            shape = new shape_box(data);
            break;
    }
    return shape;
}
;
export class sprite3d extends sprite {
    data;
    target;
    shape;
    constructor(data) {
        super(data);
        this.data = data;
        this.shape = shapeMaker(this.data.shapeType, this.data.shapeLiteral);
        this.renderCode();
        this.render();
    }
    _create() {
        super._create();
        this.material.map = this.target.texture;
        this.material.needsUpdate = true;
        tileform.stage.group.position.set(0, 0, 0);
        tileform.stage.group.updateMatrix();
    }
    renderCode() {
        this.target = pipeline.makeRenderTarget(this.data.size[0], this.data.size[1]);
    }
    render() {
        tileform.stage.prepare(this);
        tileform.stage.render();
    }
}
export default sprite3d;
