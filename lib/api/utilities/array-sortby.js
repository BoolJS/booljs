/**
 * Adds a polyfill for Array#sortBy
 */
exports.add = function () {
    // eslint-disable-next-line no-extend-native
    Array.prototype.sortBy = function (property) {
        return this.sort((a, b) => {
            if (a[property] !== b[property]) {
                return a[property] > b[property]
                    ? 1 : -1;
            }

            return 0;
        });
    };
};

/**
 * Removes the polyfill for Array#sortBy
 */
exports.delete = function () {
    delete Array.prototype.sortBy;
};
