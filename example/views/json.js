'use strict';

module.exports = function (app) {

    function view(err, data, res) {
        var status = (
            (err && (err.status || 500)) ||
            ((data && data.status) || 200)
        );

        res.status(200).json(err || data);
    }

    return {
        data: function (data, res) {
            view(null, data, res);
        },
        error: function (err, res) {
            view(err, null, res);
        },
        promise: function (promise, res, next) {
            promise.then(function (_data) {
                this.data(_data, res);
            }).catch(next);
        }
    };

};
