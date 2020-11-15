const storage = window.localStorage;

/**
 * Add an item to local storage
 * 
 * @param {string} key 
 * @param {string} value 
 */
export const set = (key, value) => {
    storage.setItem(key, value);
}

/**
 * Get a specific item from local storage
 * 
 * @param {string} key 
 */
export const get = (key) => {
    return storage.getItem(key);
}

/**
 * Deletes an item from local storage
 * 
 * @param {string} key 
 */
export const del = (key) => {
    storage.removeItem(key);
}

/**
 * Push an item to an array in local storage.
 * If it doesn't exist, array will be created
 * 
 * @param {string} key
 * @param {string} value 
 */
export const push = (key, value) => {
    let array = get[key];

    if (!array || typeof array !== 'object') {
        array = [];
    } 

    exists.push(value);

    set(key, exists);
}

/**
 * Load an array from local storage and return
 * the last item
 * 
 * @param {string} key 
 */
export const pop = (key) => {
    let array = get(key);

    if (!array || typeof array !== 'object') {
        return null;
    }

    return array.pop();
}

/**
 * Return the last item in an array,
 * or the only item that exists
 * 
 * @param {string} key 
 */
export const first = (key) => {
    let array = get(key);

    if (!array) {
        return null;
    }

    if (typeof array !== 'object' && value.constructor !== Array) {
        return array;
    }

    return array[0];
}

/**
 * Return the last item in an array,
 * or the only item that exists
 * 
 * @param {string} key 
 */
export const last = (key) => {
    let array = get(key);

    if (!array) {
        return null;
    }

    if (typeof array !== 'object' && value.constructor !== Array) {
        return array;
    }

    return array[array.length - 1];
}