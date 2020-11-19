class Emitter {
    constructor() {
        /**
         * eventName: [callbacks]
         */
        this.events = {};
    }

    on = (e, callback) => {
        if (!this.events[e]) {
            this.events[e] = [];
        }

        this.events[e].push(callback);
    }

    emit = (e, ...data) =>{
        this.events[e].forEach(callback => {
            callback(...data);
        });
    }

    static getInstance() {
        if (!Emitter._instance) {
            Emitter._instance = new Emitter();
        }

        return Emitter._instance;
    }
}

export const events = (function() { 
    return Emitter.getInstance() 
})();