const { pathsToModuleNameMapper } = require('ts-jest');

const { compilerOptions } = require('./tsconfig');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    roots: ['<rootDir>/src'],
    modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/'
    }),
    extensionsToTreatAsEsm: ['.ts'],
};
