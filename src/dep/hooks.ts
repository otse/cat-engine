/// Hooks run front to back latest to last

export namespace hooks {
	export type func = (any) => boolean;//Promise<boolean>
}

export class hooks<T = never> {
	static readonly hooks: { [name: string]: hooks.func[] } = {}
	static create(name: string) {
		if (!(name in this.hooks)) this.hooks[name] = [];
	}
	static addListener(name: string, callback: hooks.func) {
		this.create(name);
		this.hooks[name].push(callback);
	}
	static removeListener(name: string, callback: hooks.func) {
		this.hooks[name] = this.hooks[name].filter(e => e !== callback);
	}
	static placeListener(name: string, index: number, callback: hooks.func) {
		this.create(name);
		if (this.hooks[name][index] !== undefined)
			console.error(`Error: Hook '${name}' already has a function registered at index ${index}`);
		this.hooks[name][index] = callback;
	}
	static async emit(name: string, x: any) {
		return this._emitFast(name, x);
	}
	static async _emitFast(name: string, x: any) {
		if (!(name in this.hooks)) return;
		for (let i = this.hooks[name].length; i--;)
			if (await (this.hooks[name][i]?.(x))) return;
	}
}

export default hooks;