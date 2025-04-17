module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest'
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1', //讓Jest識別 @ 開頭的 import
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    }
};