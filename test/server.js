/* global describe, before, it */
'use strict';

const Bool = require('..');

describe('Server', () => it(
    'starts the default server', () => new Bool('com.example.api').bootServer()
));
