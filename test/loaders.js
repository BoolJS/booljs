'use strict';

const Bool = require('..');

describe('Loaders', () => {
    let api;

    before(() => (api = new Bool('com.example.api')));
    it('fetch models', () => api.loadDatabase());
    it('fetch components', () => api.loadComponents());
});
