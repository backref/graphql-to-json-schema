/**
 * eslint for node. React settings are found in src/.eslintrc.js
 */
module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',

    // Enables eslint-plugin-prettier and eslint-config-prettier. This will
    // display prettier errors as ESLint errors. Make sure this is always
    // the last configuration in the extends array.
    'plugin:prettier/recommended',

    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['prefer-object-spread', 'prettier', '@typescript-eslint'],
  rules: {
    'no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
    'prefer-object-spread/prefer-object-spread': 'error',
    '@typescript-eslint/ban-ts-comment': 1,

    // Use template strings instead of string concatenation
    //'prefer-template': 1,

    // This is documented as the default, but apparently now needs to be
    // set explicitly
    'prettier/prettier': [
      'error',
      {},
      {
        usePrettierrc: true,
      },
    ],
  },
}
