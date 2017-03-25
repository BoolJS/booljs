/* global describe, before, it */
'use strict';

const booljs = require('..');

describe('Configuration', () => {
    it(
        'read and load configuration files into instance',
        done => { booljs('com.example.api').readConfigurations(done) }
    );

    it(
        'return a promise',
        () => booljs('com.example.api2').setBase('example').readConfigurations()
    );
});
