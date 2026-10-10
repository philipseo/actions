export default {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  // @octokit/* and @actions/* ship ESM only
  transformIgnorePatterns: [
    'node_modules/(?!(\\.pnpm|@octokit|@actions|universal-user-agent|before-after-hook|fast-content-type-parse|json-with-bigint|toad-cache|content-type))',
  ],
  moduleNameMapper: {
    '#/(.*)$': '<rootDir>/src/$1',
  },
};
