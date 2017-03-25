/* global describe, it */
'use strict';

const booljs  = require('..');

describe('API', () => it('initializes application instance', () => {
        let app = booljs('com.example.api');
        app.setBase('example');
}));
