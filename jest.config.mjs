export default {
  testEnvironment: 'node',
  resolver: '<rootDir>/jest.resolver.cjs',
  // tests run as CJS; ESM-only deps are transpiled along with src
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'commonjs',
          moduleResolution: 'node10',
          allowJs: true,
          isolatedModules: true,
        },
      },
    ],
  },
  transformIgnorePatterns: [],
  moduleNameMapper: {
    '#/(.*)$': '<rootDir>/src/$1',
  },
};
