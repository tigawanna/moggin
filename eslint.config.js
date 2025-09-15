// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    plugins: ['react-compiler'],
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    plugins: ['testing-library'],
    rules: {
      ...require('eslint-plugin-testing-library/configs/react').rules,
    },
  },
]);
