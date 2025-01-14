export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      semi: ['error', 'never'],
      'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
      'quotes': ['error', 'single'],
      'eqeqeq': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'indent': ['error', 2],
      'no-console': 'off',
    },
  },
]
