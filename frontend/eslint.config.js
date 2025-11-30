import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import globals from 'globals';

import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: ['dist', 'node_modules', 'build', '.yarn'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
      },
    },
    settings: {
      react: {
        version: '18.2',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      'import': importPlugin,
    },
    rules: {
      // Base ESLint rules (Airbnb style)
      ...js.configs.recommended.rules,

      // Formatting rules - Airbnb style
      'indent': ['error', 2, {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        FunctionDeclaration: {
          parameters: 1,
          body: 1,
        },
        FunctionExpression: {
          parameters: 1,
          body: 1,
        },
        CallExpression: {
          arguments: 1,
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoreComments: false,
      }],
      'quotes': ['error', 'single', {
        avoidEscape: true,
      }],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      }],
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'no-multiple-empty-lines': ['error', {
        max: 1,
        maxEOF: 0,
      }],
      'eol-last': ['error', 'always'],
      'comma-spacing': ['error', {
        before: false,
        after: true,
      }],
      'key-spacing': ['error', {
        beforeColon: false,
        afterColon: true,
      }],
      'keyword-spacing': ['error', {
        before: true,
        after: true,
      }],
      'space-before-blocks': ['error', 'always'],
      'space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      }],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': ['error', {
        words: true,
        nonwords: false,
      }],
      'brace-style': ['error', '1tbs', {
        allowSingleLine: true,
      }],
      'no-whitespace-before-property': 'error',
      'padded-blocks': ['error', 'never'],
      'no-extra-parens': ['error', 'all', {
        conditionalAssign: true,
        nestedBinaryExpressions: false,
        returnAssign: false,
        ignoreJSX: 'all',
        enforceForArrowConditionals: false,
      }],
      'arrow-spacing': ['error', {
        before: true,
        after: true,
      }],
      'block-spacing': ['error', 'always'],
      'computed-property-spacing': ['error', 'never'],
      'func-call-spacing': ['error', 'never'],
      'generator-star-spacing': ['error', {
        before: false,
        after: true,
      }],
      'newline-per-chained-call': ['error', {
        ignoreChainWithDepth: 4,
      }],
      'no-mixed-spaces-and-tabs': 'error',
      'object-curly-newline': ['error', {
        ObjectExpression: {
          minProperties: 3,
          multiline: true,
          consistent: true,
        },
        ObjectPattern: {
          minProperties: 3,
          multiline: true,
          consistent: true,
        },
        ImportDeclaration: {
          minProperties: 3,
          multiline: true,
          consistent: true,
        },
        ExportDeclaration: {
          minProperties: 3,
          multiline: true,
          consistent: true,
        },
      }],
      'object-property-newline': [
        'warn',
        {
          'allowAllPropertiesOnSameLine': false,
        },
      ],
      'rest-spread-spacing': ['error', 'never'],
      'template-curly-spacing': 'error',
      'yield-star-spacing': ['error', 'after'],

      // Logic rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off', // Use TypeScript version instead
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'no-duplicate-imports': 'error',
      'no-useless-constructor': 'error',
      'prefer-destructuring': ['error', {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: false,
        },
      }],

      // TypeScript rules (without type checking)
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      // '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',

      // React rules (Airbnb React style)
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-filename-extension': ['error', {
        extensions: ['.jsx', '.tsx'],
      }],
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-curly-newline': 'off',
      'react/jsx-wrap-multilines': ['error', {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line',
      }],
      'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
      'react/jsx-closing-tag-location': 'error',
      'react/jsx-curly-spacing': ['error', 'never', {
        allowMultiline: true,
      }],
      'react/jsx-equals-spacing': ['error', 'never'],
      'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-max-props-per-line': ['error', {
        maximum: 1,
        when: 'multiline',
      }],
      'react/jsx-tag-spacing': ['error', {
        closingSlash: 'never',
        beforeSelfClosing: 'always',
        afterOpening: 'never',
        beforeClosing: 'never',
      }],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],

      // React Hooks rules
      ...reactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'off',

      // React Refresh rules
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],

      // JSX a11y rules (accessibility)
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/img-redundant-alt': 'error',
      'jsx-a11y/label-has-associated-control': 'error',

      // Import rules
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      // Additional Airbnb rules
      'max-len': ['off', {
        code: 100,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
      }],
      'no-param-reassign': ['error', {
        props: false,
      }],
      'arrow-parens': ['error', 'always'],
      'consistent-return': 'off',
      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',
    },
  },
  // Test files configuration
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.browser,
      },
    },
    rules: {
      'no-console': 'off',
      'import/no-extraneous-dependencies': 'off',
      'max-len': 'off',
    },
  },
  // Config files
  {
    files: ['**/*.config.{js,ts}', '**/vite.config.{js,ts}', '*.config.{js,ts}'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-console': 'off',
      'import/no-extraneous-dependencies': 'off',
      'max-len': 'off',
    },
  },
];
