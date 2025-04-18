/// Hooks run front to back latest to last
export class hooks {
    static hooks = {};
    static create(name) {
        if (!(name in this.hooks))
            this.hooks[name] = [];
    }
    static addListener(name, callback) {
        this.create(name);
        this.hooks[name].push(callback);
    }
    static removeListener(name, callback) {
        this.hooks[name] = this.hooks[name].filter(e => e !== callback);
    }
    static placeListener(name, index, callback) {
        this.create(name);
        if (this.hooks[name][index] !== undefined)
            console.error(`Error: Hook '${name}' already has a function registered at index ${index}`);
        this.hooks[name][index] = callback;
    }
    static async emit(name, x) {
        return this._emitFast(name, x);
    }
    static async _emitFast(name, x) {
        if (!(name in this.hooks))
            return;
        for (let i = this.hooks[name].length; i--;)
            if (await (this.hooks[name][i]?.(x)))
                return;
    }
}
export default hooks;
