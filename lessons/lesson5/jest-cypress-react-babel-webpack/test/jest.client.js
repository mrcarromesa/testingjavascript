module.exports = {
  ...require('./jest-common'),
  displayName: 'client',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  snapshotSerializers: ['jest-emotion'],
  // testMatch: ['**/__tests__/**/*.js', '!**/__server_tests__/**/*.js'],
}