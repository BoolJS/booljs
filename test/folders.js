'use strict';

const Bool = require('..');

describe('Folders', function () {
    it('creates initial pre-structure', () => {
        return new Bool('com.example.api').readFiles();
    });
});
