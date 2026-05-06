import google from 'eslint-config-google';
delete google.rules['valid-jsdoc'];
delete google.rules['require-jsdoc'];

import jsdoc from 'eslint-plugin-jsdoc';
import globals from 'globals';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
delete reactHooks.configs.recommended.rules['react-hooks/exhaustive-deps'];
import {fixupPluginRules, fixupConfigRules} from '@eslint/compat';
import tseslint from 'typescript-eslint';

export default [
  google,
  js.configs.recommended,
  jsdoc.configs['flat/recommended'],
  ...fixupConfigRules(react.configs.flat.recommended),
  // ...fixupConfigRules(react.configs.flat.all),
  ...fixupConfigRules(react.configs.flat['jsx-runtime']), // For React 17+
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['src/**/*.{ts,tsx}', 'test/**/*.{ts,tsx}'],
    ignores: ['coverage/', 'dist/'],
    plugins: {
      jsdoc,
      react: fixupPluginRules(react),
      'react-hooks': fixupPluginRules(reactHooks),
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      ecmaVersion: 2025,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
  },
];
