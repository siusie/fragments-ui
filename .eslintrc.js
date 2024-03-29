module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    browser: true
  },
  extends: 'eslint:recommended',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  ignorePatterns: ['**/src/*.html'],
  rules: {},
};