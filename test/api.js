/* global describe, it */
'use strict';

const Bool = require('..');

describe('API', () => it('initializes application instance', () => {
    const app = new Bool('com.example.api');
    return app.setBase('example');
}));
