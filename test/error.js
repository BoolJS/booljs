'use strict';

const Bool = require('..');

describe('BoolError', () => it(
    'is added to app components', () => new Bool('com.example.api')
        .insertBoolError()
));
