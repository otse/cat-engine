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
        },
        star: {
            shapeGroundTexture: './img/textures/star.jpg',
            shapeGroundTextureNormal: './img/textures/starnormal.jpg',
        }
    };
    game.shapePresets = {
        default: {
            shapeTexture: './img/textures/wall2.jpg',
            shapeTextureNormal: './img/textures/wall2normal.jpg',
        },
        elven: {
            shapeTexture: './img/textures/japanese3.jpg',
            shapeTextureNormal: './img/textures/cobblestone2normal.jpg',
        },
        basalt: {
            shapeTexture: './img/textures/basaltcliffs.jpg',
            shapeTextureNormal: './img/textures/basalt.jpg',
        }
    };
    function init() {
        land.init();
        repopulate();
    }
    game.init = init;
    function update() {
        // Does nothing!
    }
    game.update = update;
    function repopulate() {
        land.repopulate();
    }
    game.repopulate = repopulate;
})(game || (game = {}));
export default game;
