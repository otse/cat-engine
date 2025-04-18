import hooks from "./dep/hooks.js";
import pts from "./dep/pts.js";
import worldetch from "./worldetch.js";
import renderer from "./worldetch/renderer.js";
import glob from "./dep/glob.js";

namespace app {
	window['App'] = app;
	export enum KEY {
		OFF = 0,
		PRESS,
		WAIT,
		AGAIN,
		UP
	};
	export enum MOUSE {
		UP = - 1,
		OFF = 0,
		DOWN,
		STILL
	};
	export var error;
	export var feed = 'abc';
	var keys = {};
	var buttons = {};
	var pos: vec2 = [0, 0];
	export var wheel = 0;
	export var mobile = false;

	export function onkeys(event) {
		if (!event.key)
			return;
		const key = event.key.toLowerCase();
		if ('keydown' == event.type)
			keys[key] = keys[key] ? KEY.AGAIN : KEY.PRESS;
		else if ('keyup' == event.type)
			keys[key] = KEY.UP;
		if (event.keyCode == 112 ||
			event.keyCode == 113 ||
			event.keyCode == 114 ||
			event.keyCode == 115 ||
			event.keyCode == 116
		)
			event.preventDefault();	
	}
	export function key(k: string) {
		return keys[k];
	}
	export function button(b: number) {
		return buttons[b];
	}
	export function mouse(): vec2 {
		return [...pos];
	}
	export async function boot(version: string) {
		console.log('boot');
		mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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
			wheel = e.deltaY < 0 ? 1 : -1;
		}
		let touchStart: vec2 = [0, 0];
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
			const touchEnd: vec2 = [e.pageX, e.pageY];
			buttons[0] = MOUSE.UP;
			hooks.emit('onmouseup', false);
			//buttons[2] = MOUSE.UP;

			if (pts.equals(touchEnd, touchStart) /*&& buttons[2] != MOUSE.STILL*/) {
				//buttons[2] = MOUSE.DOWN;
			}/*
			else if (!pts.equals(touchEnd, touchStart)) {
				buttons[2] = MOUSE.UP;
			}
			//message("ontouchend");*/
			//return false;
		}

		function onerror(message) { document.querySelectorAll('.stats')[0].innerHTML = message; }
		if (mobile) {
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
		await worldetch.init();
		const blockable = trick_animation_frame(base_loop);
	}
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
		let beginTime = (performance || Date).now(), prevTime = beginTime, frames = 0
		return function () {
			frames++;
			var time = (performance || Date).now();
			if (time >= prevTime + 1000) {
				let fps = (frames * 1000) / (time - prevTime);
				prevTime = time;
				frames = 0;
				glob.fps = fps;
			}
		}
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

	export async function base_loop() {
		take_time();
		take_delta();
		await worldetch.step();
		await hooks.emit('animationFrame', 1);
		// await hooks.emit('animationFrame', false);
		renderer.render();
		wheel = 0;
		process_keys();
		process_mouse_buttons();
	}
	export async function trick_animation_frame(callback) {
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
	async function sleep() {
		return new Promise(requestAnimationFrame);
	}
	export function sethtml(selector, html) {
		let element = document.querySelector(selector);
		element.innerHTML = html;
	}
}

export default app;