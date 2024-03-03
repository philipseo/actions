const baseConfig = require('@philipseo/configs/jest/base');

module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    '#/(.*)$': '<rootDir>/src/$1',
  },
};
