import { hooks } from "./dep/hooks.js";
import pts from "./dep/pts.js";
import rome from "./rome.js";
import pipeline from "./core/pipeline.js";
import glob from "./dep/glob.js";
import zoom from "./core/components/zoom.js";
import tileform from "./core/tileform.js";
import clod from "./core/clod.js";
var app;
(function (app) {
    window['App'] = app;
    let KEY;
    (function (KEY) {
        KEY[KEY["OFF"] = 0] = "OFF";
        KEY[KEY["PRESS"] = 1] = "PRESS";
        KEY[KEY["WAIT"] = 2] = "WAIT";
        KEY[KEY["AGAIN"] = 3] = "AGAIN";
        KEY[KEY["UP"] = 4] = "UP";
    })(KEY = app.KEY || (app.KEY = {}));
    ;
    let MOUSE;
    (function (MOUSE) {
        MOUSE[MOUSE["UP"] = -1] = "UP";
        MOUSE[MOUSE["OFF"] = 0] = "OFF";
        MOUSE[MOUSE["DOWN"] = 1] = "DOWN";
        MOUSE[MOUSE["STILL"] = 2] = "STILL";
    })(MOUSE = app.MOUSE || (app.MOUSE = {}));
    ;
    app.feed = 'abc';
    var keys = {};
    var buttons = {};
    var pos = [0, 0];
    app.wheel = 0;
    app.mobile = false;
    function onkeys(event) {
        if (!event.key)
            return;
        const key = event.key.toLowerCase();
        if ('keydown' == event.type)
            keys[key] = keys[key] ? KEY.AGAIN : KEY.PRESS;
        else if ('keyup' == event.type)
            keys[key] = KEY.UP;
        if (event.keyCode == 114)
            event.preventDefault();
    }
    app.onkeys = onkeys;
    function key(k) {
        return keys[k];
    }
    app.key = key;
    function button(b) {
        return buttons[b];
    }
    app.button = button;
    function mouse() {
        return [...pos];
    }
    app.mouse = mouse;
    async function boot(version) {
        console.log('boot');
        app.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        function onmousemove(e) {
            pos[0] = e.clientX;
            pos[1] = e.clientY;
            hooks.emit('onmousemove', false);
        }
        function onmousedown(e) {
            buttons[e.button] = 1;
            if (e.button == 1)
                return false;
            hooks.emit('onmousedown', false);
        }
        function onmouseup(e) {
            buttons[e.button] = MOUSE.UP;
            hooks.emit('onmouseup', false);
        }
        function onwheel(e) {
            app.wheel = e.deltaY < 0 ? 1 : -1;
        }
        let touchStart = [0, 0];
        function ontouchstart(e) {
            //message("ontouchstart");
            touchStart = [e.pageX, e.pageY];
            pos[0] = e.pageX;
            pos[1] = e.pageY;
            hooks.emit('onmousedown', false);
            //if (app.mobile)
            //	glob.win_propagate_events(e);
            //buttons[2] = MOUSE.UP;
            //buttons[2] = MOUSE.DOWN; // rclick
            //return false;
        }
        function ontouchmove(e) {
            //message("ontouchmove");
            pos[0] = e.pageX;
            pos[1] = e.pageY;
            //if (!buttons[0])
            buttons[0] = KEY.PRESS;
            //return false;
            //console.log('touch move');
            //if (app.mobile)
            //	glob.win_propagate_events(e);
            e.preventDefault();
            hooks.emit('onmousemove', false);
            return false;
        }
        function ontouchend(e) {
            //message("ontouchend");
            const touchEnd = [e.pageX, e.pageY];
            buttons[0] = MOUSE.UP;
            hooks.emit('onmouseup', false);
            //buttons[2] = MOUSE.UP;
            if (pts.equals(touchEnd, touchStart) /*&& buttons[2] != MOUSE.STILL*/) {
                //buttons[2] = MOUSE.DOWN;
            } /*
            else if (!pts.equals(touchEnd, touchStart)) {
                buttons[2] = MOUSE.UP;
            }
            //message("ontouchend");*/
            //return false;
        }
        function onerror(message) { document.querySelectorAll('.stats')[0].innerHTML = message; }
        if (app.mobile) {
            document.ontouchstart = ontouchstart;
            document.ontouchmove = ontouchmove;
            document.ontouchend = ontouchend;
        }
        else {
            document.onkeydown = document.onkeyup = onkeys;
            document.onmousemove = onmousemove;
            document.onmousedown = onmousedown;
            document.onmouseup = onmouseup;
            document.onwheel = onwheel;
        }
        await rome.init();
        const blockable = trick_animation_frame(base_loop);
    }
    app.boot = boot;
    function process_keys() {
        for (let i in keys) {
            if (keys[i] == KEY.PRESS)
                keys[i] = KEY.WAIT;
            else if (keys[i] == KEY.UP)
                keys[i] = KEY.OFF;
        }
    }
    function process_mouse_buttons() {
        for (let b of [0, 1, 2])
            if (buttons[b] == MOUSE.DOWN)
                buttons[b] = MOUSE.STILL;
            else if (buttons[b] == MOUSE.UP)
                buttons[b] = MOUSE.OFF;
    }
    const take_time = (() => {
        let beginTime = (performance || Date).now(), prevTime = beginTime, frames = 0;
        return function () {
            frames++;
            var time = (performance || Date).now();
            if (time >= prevTime + 1000) {
                let fps = (frames * 1000) / (time - prevTime);
                prevTime = time;
                frames = 0;
                glob.fps = fps;
            }
        };
    })();
    const take_delta = (() => {
        let last = 0;
        return function () {
            const now = (performance || Date).now();
            let delta = (now - last) / 1000;
            last = now;
            glob.delta = delta;
        };
    })();
    async function base_loop() {
        take_time();
        take_delta();
        await rome.step();
        await hooks.emit('animationFrame', false);
        document.querySelector('rome-stats').innerHTML = `
		DOTS_PER_INCH_CORRECTED_RENDER_TARGET: ${pipeline.DOTS_PER_INCH_CORRECTED_RENDER_TARGET}
		<br />&#9;ROUND_UP_DOTS_PER_INCH: ${pipeline.ROUND_UP_DOTS_PER_INCH}
		<br />&#9;ALLOW_NORMAL_MAPS (f3): ${tileform.ALLOW_NORMAL_MAPS}
		<br />scale: ${glob.scale}
		<br />fps: ${glob.fps?.toFixed(2)}
		<br />delta: ${glob.delta?.toFixed(3)}
		<br />zoom: ${zoom.actualZoom()}
		<br />glob.rerender: ${glob.rerender}
		<br />glob.rerenderGame: ${glob.rerenderGame}
		<br />cameraMode: ${pipeline.cameraMode}
		<br />objs: ${clod.numbers.objs[0]} / ${clod.numbers.objs[1]}
		<br />gobjs: ${glob.gameobjects[0]} / ${glob.gameobjects[1]}
		<br />chunks: ${clod.numbers.chunks[0]} / ${clod.numbers.chunks[1]}
		`;
        pipeline.render();
        app.wheel = 0;
        process_keys();
        process_mouse_buttons();
    }
    app.base_loop = base_loop;
    async function trick_animation_frame(callback) {
        let run = true;
        do {
            await sleep();
            await callback();
        } while (run);
        return {
            runs: () => run,
            stop: () => run = false,
        };
    }
    app.trick_animation_frame = trick_animation_frame;
    async function sleep() {
        return new Promise(requestAnimationFrame);
    }
    function sethtml(selector, html) {
        let element = document.querySelector(selector);
        element.innerHTML = html;
    }
    app.sethtml = sethtml;
})(app || (app = {}));
export default app;
