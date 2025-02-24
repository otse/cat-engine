import land from "./land.js";
export var game;
(function (game) {
    game.groundPresets = {
        default: {
            shapeGroundTexture: './img/textures/beach.jpg',
            shapeGroundTextureNormal: './img/textures/beachnormal.jpg',
        },
        stonemixed: {
            shapeGroundTexture: './img/textures/stonemixed2.jpg',
            shapeGroundTextureNormal: './img/textures/stonemixed2normal.jpg',
        },
        cobblestone: {
            shapeGroundTexture: './img/textures/cobblestone3.jpg',
            shapeGroundTextureNormal: './img/textures/cobblestone3normal.jpg',
        },
        water: {
            shapeGroundTexture: './img/textures/water.jpg',
            shapeGroundTextureNormal: './img/textures/beachnormal.jpg',
        }
    };
    function init() {
        land.init();
        land.make();
    }
    game.init = init;
    function update() {
        // Does nothing!
    }
    game.update = update;
    function repopulate() {
        land.make();
    }
    game.repopulate = repopulate;
})(game || (game = {}));
export default game;
