const prettierConfig = require('@philipseo/configs/lint-staged/prettier');

/* TODO: js-kit lint-staged, eslint flat option 변경 필요 */
module.exports = {
  '*.{js,jsx,ts,tsx}': 'eslint --ignore-path .eslintignore',
  ...prettierConfig,
};
