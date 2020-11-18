const localStorage = window.localStorage;

export const storage = {
    /**
     * Add an item to local storage
     * 
     * @param {string} key 
     * @param {string} value 
     */
    set: (key, value) => {
        localStorage.setItem(key, value);
    },

    /**
     * Get a specific item from local storage
     * 
     * @param {string} key 
     */
    get: (key) => {
        return localStorage.getItem(key);
    },

    /**
     * Deletes an item from local storage
     * 
     * @param {string} key 
     */
    del: (key) => {
        localStorage.removeItem(key);
    },

    /**
     * Push an item to an array in local storage.
     * If it doesn't exist, array will be created
     * 
     * @param {string} key
     * @param {string} value 
     */
    push: (key, value) => {
        let array = get(key);

        if (array) {
            array = JSON.parse(array);
        }
        
        if (typeof array !== 'object') {
            array = [];
        } 

        array.push(value);

        set(key, JSON.stringify(array));
    },

    /**
     * Load an array from local storage and return
     * the last item
     * 
     * @param {string} key 
     */
    pop: (key) => {
        let array = get(key);

        if (array) {
            array = JSON.parse(array);
        }

        if (typeof array !== 'object') {
            return null;
        }

        let val = array.pop();

        set(key, JSON.stringify(array));
        return val;
    },

    /**
     * Return the last item in an array,
     * or the only item that exists
     * 
     * @param {string} key 
     */
    first: (key) => {
        let array = get(key);

        if (!array) {
            return null;
        }

        if (typeof array !== 'object' && value.constructor !== Array) {
            return array;
        }

        return array[0];
    },

    /**
     * Return the last item in an array,
     * or the only item that exists
     * 
     * @param {string} key 
     */
    last: (key) => {
        let array = get(key);

        if (!array) {
            return null;
        }

        if (typeof array !== 'object' && value.constructor !== Array) {
            return array;
        }

        return array[array.length - 1];
    },


    /**
     * Check if the given key is set to something
     */
    exists: (key) => {
        let val = localStorage.getItem(key);

        if (val) {
            return true;
        }

        return false;
    }
}