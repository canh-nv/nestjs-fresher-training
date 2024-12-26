/* eslint-disable prettier/prettier */
module.exports = {

    rootDir: './',


    moduleFileExtensions: ['js', 'json', 'ts'],


    testRegex: '.*\\.spec\\.ts$', 

 
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },

    
    coverageDirectory: './coverage',

   
    collectCoverageFrom: [
        '**/*.(t|j)s', 
    ],

   
    testEnvironment: 'node',

    
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1', 
    },

    
    coverageReporters: ['text', 'lcov'],
};
