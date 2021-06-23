module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  plugins: ['prettier', 'ramda'],
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    strict: [2, 'global'],
    'space-before-function-paren': 'off',
    'no-underscore-dangle': 0,
    'no-confusing-arrow': 'off',
    'object-curly-newline': 'off',
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external', 'internal'],
          ['parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
      },
    ],
    quotes: ['error', 'single', { avoidEscape: true }],
    'ramda/always-simplification': ['error'],
    'ramda/compose-simplification': ['error'],
    'ramda/eq-by-simplification': ['error'],
    'ramda/prefer-complement': ['error'],
    'ramda/prefer-both-either': ['error'],
    'prettier/prettier': 'error',
  },
};
