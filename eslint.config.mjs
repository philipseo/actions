import base from '@philipseo/configs/eslint/base';

export default [
  { ignores: ['dist/', 'coverage/', 'node_modules/'] },
  ...base,
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { module: 'writable', require: 'readonly' },
    },
  },
];
