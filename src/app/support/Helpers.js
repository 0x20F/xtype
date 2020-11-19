export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Shortens a number and turns it into a string
 * Stolen from: https://stackoverflow.com/questions/10599933/convert-long-number-into-abbreviated-string-in-javascript-with-a-special-shortn
 * Tweaked by me.
 * 
 * @param {number} value 
 */
export const abbreviateNumber = (value) => {
    let newValue = value;

    if (value < 1000) {
        return value;
    }

    const suffixes = ['', 'k', 'm', 'b', 't'];
    const suffixNum = Math.floor(('' + value).length / 3);
    let shortValue = '';
    for (var precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
        var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
        
        if (dotLessShortValue.length <= 2) { 
            break; 
        }
    }

    if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
    
    newValue = shortValue + suffixes[suffixNum];
    
    return newValue;
}



/**
 * Cut the given string if too long and append 
 * three dots (...) to the end of it
 * 
 * @param {string} str 
 * @param {number} length 
 */
export const truncate = (str, length) => {
    return (str.length > length) ? str.substr(0, length-1) + '...' : str;
}