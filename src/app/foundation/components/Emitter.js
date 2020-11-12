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
}

export default Emitter;