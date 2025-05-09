import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    // language options.
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // 'no-console': 'error',
      'no-unused-vars': 'error', // Warn on unused variables
      'no-undef': 'error', // Disallow undeclared variables
      'prefer-const': 'warn', // Prefer const over let when variable is not reassigned
      'no-var': 'error', // Disallow usage of var
      quotes: ['error', 'single'], // Enforce single quotes
      indent: ['error', 2], // Enforce 2 spaces indentation
      // Add more rules as needed
    },
  },
  pluginJs.configs.recommended,
];
