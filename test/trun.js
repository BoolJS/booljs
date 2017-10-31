'use strict';

const Bool = require('..');

describe('Run', () => it('all together now', () => {
    process.env.PORT = 3002;
    return new Bool('com.example.run')
        .setBase('example')
        .run();
}));
