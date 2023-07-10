const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    testPathIgnorePatterns: ['aws', 'fixtures'],
    moduleNameMapper: {
        '(estree-walker|periscopic|is-reference)': '<rootDir>/node_modules/$1/src/index.js'
    },
    setupFilesAfterEnv: ['jest-expect-message', '<rootDir>/jest.setup.js'],
    verbose: true
};

module.exports = createJestConfig(customJestConfig);
