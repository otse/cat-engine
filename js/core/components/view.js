import hooks from "../../dep/hooks";
export class view {
    static register() {
        hooks.addListener('worldetchComponents', this.step);
        this.startup();
    }
    static async step() {
        return false;
    }
    static startup() {
    }
}
export default view;
