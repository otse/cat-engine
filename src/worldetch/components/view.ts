import hooks from "../../dep/hooks";


// Basic idea for a component system that manages the view

// Never made

class view {
    static register() {
        hooks.addListener('worldetchComponents', this.step);
        this.startup();
    }

    static step() {
        return false;
    }

    static startup() {
        
    }
}

export default view;