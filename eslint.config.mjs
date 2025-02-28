import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create compat instance
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

// Define ignores at the top level
const ignores = ['webpack.config.js', 'dist/**', 'node_modules/**'];

export default [
  // Specify ignores at the top level
  {
    ignores
  },
  
  // Base ESLint recommended rules
  js.configs.recommended,
  
  // Use compatibility function to convert React plugin configs
  ...compat.extends(
    'plugin:react/recommended', 
    'plugin:react-hooks/recommended'
  ),
  
  // Add our custom configuration
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
      },
    },
  },
  
  // Custom rules for all JavaScript files
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'no-unused-vars': 'warn',
      'react/prop-types': 'warn',
      // Enable these rules to properly detect React usage in JSX
      'react/react-in-jsx-scope': 'error', 
      'react/jsx-uses-react': 'error',
      // This tells ESLint that React is used when JSX is used
      'react/jsx-uses-vars': 'error',
    },
  },
  
  // Specific rules for source files
  {
    files: ['src/**/*.{js,jsx}'],
    rules: {
      'no-console': 'warn',
    },
  },
  
  // Specific rules for test files
  {
    files: ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}'],
    rules: {
      'no-console': 'off',
    },
  },
];