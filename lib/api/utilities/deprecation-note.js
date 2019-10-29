/**
 * Marks a method as deprecated
 * @param {String} version The version since the method is being deprecated
 * @param {String} insteadUse A function to use instead this function
 * @param {Boolean?} deprecated Whether this function is already deprecated
 */
module.exports = function (version, insteadUse, deprecated = false) {
    const message = `
    DEPRECATION NOTE
    This method ${deprecated
        ? 'was deprecated'
        : 'is being deprecated'} since v${version}.
    STOP using it and instead use #${insteadUse}`;

    if (deprecated) {
        throw new Error(message);
    } else {
        console.log(message);
    }
};
