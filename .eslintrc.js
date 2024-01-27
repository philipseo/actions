module.exports = {
  root: true,
  extends: [require.resolve('@philipseo/configs/eslint/library')],
  parserOptions: {
    project: require.resolve('./tsconfig.json'),
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: require.resolve('./tsconfig.json'),
      },
    },
  },
};
