'use strict';

const Bool = require('..');

describe('Configuration', () => {
    it('Reads and loads configuration files into instance', () => {
        return new Bool('com.example.api2')
            .setBase('example')
            .readConfigurations();
    });
});
