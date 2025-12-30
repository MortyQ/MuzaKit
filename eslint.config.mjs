// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import eslint from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';

export default [
    {
        ignores: [
            '**/*.d.ts',
            '**/coverage',
            '**/dist',
            '*.config.ts',
            '*.config.mjs',
            '*.config.js',
        ],
    },
    // Base configs
    eslint.configs.recommended,
    ...typescriptEslint.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    // Stylistic customize returns an object
    stylistic.configs.customize({
        pluginName: 'style',
    }),

    // Project rules for TypeScript files
    {
        files: ['**/*.{ts,js}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.browser,
            parser: typescriptEslint.parser,
        },
        plugins: {
            import: importPlugin,
        },
        settings: {
            'import/resolver': {
                typescript: {
                    project: ['./tsconfig.json'],
                },
                node: {
                    extensions: ['.js', '.ts', '.vue'],
                },
            },
        },
        rules: {
            'vue/multi-word-component-names': ['error', {
                ignores: ['index'],
            }],
            'style/max-statements-per-line': 'off',
            'import/order': ['error', {
                groups: [
                    'builtin',
                    'external',
                    'parent',
                    'sibling',
                    'index',
                    'internal', // internal placed after relatives so we can push components to absolute end
                ],
                pathGroups: [
                    {
                        pattern: '@/components/**',
                        group: 'internal',
                        position: 'after',
                    },
                    {
                        pattern: '@/**',
                        group: 'internal',
                        position: 'before',
                    },
                ],
                pathGroupsExcludedImportTypes: ['builtin'],
                alphabetize: {order: 'asc', caseInsensitive: true},
                'newlines-between': 'always',
            }],
            "vue/no-empty-component-block": "error",
            'import/newline-after-import': ['error', {count: 1}],
            'import/no-duplicates': 'error',
            'style/max-len': ['error', {
                code: 100,
                tabWidth: 2,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
                ignoreComments: true,
                ignorePattern: '^\\s*@apply\\b',
            }],
            'style/indent': ['error', 2],
            'style/semi': ['error', 'always'],
            'style/semi-style': ['error', 'last'],
            'style/quotes': ['error', 'double', {allowTemplateLiterals: true, avoidEscape: false}],
            'style/quote-props': ['error', 'as-needed'],
            'style/jsx-quotes': ['error', 'prefer-double'],
            'style/comma-dangle': ['error', 'always-multiline'],
            'style/comma-style': ['error', 'last'],
            'style/object-curly-spacing': ['error', 'always'],
            'style/jsx-closing-bracket-location': ['error', {
                nonEmpty: 'tag-aligned',
                selfClosing: 'after-props',
            }],
            'style/arrow-parens': ['error', 'always'],

            '@typescript-eslint/no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            }],
        },
    },

    // Separate configuration for Vue files
    {
        files: ['**/*.vue'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.browser,
            parserOptions: {
                parser: typescriptEslint.parser,
            },
        },
        plugins: {
            import: importPlugin,
        },
        settings: {
            'import/resolver': {
                typescript: {
                    project: ['./tsconfig.json'],
                },
                node: {
                    extensions: ['.js', '.ts', '.vue'],
                },
            },
        },
        rules: {
            'vue/multi-word-component-names': ['error', {
                ignores: ['index'],
            }],
            'import/order': ['error', {
                groups: [
                    'builtin',
                    'external',
                    'parent',
                    'sibling',
                    'index',
                    'internal', // internal placed after relatives so we can push components to absolute end
                ],
                pathGroups: [
                    {
                        pattern: '@/components/**',
                        group: 'internal',
                        position: 'after',
                    },
                    {
                        pattern: '@/**',
                        group: 'internal',
                        position: 'before',
                    },
                ],
                pathGroupsExcludedImportTypes: ['builtin'],
                alphabetize: {order: 'asc', caseInsensitive: true},
                'newlines-between': 'always',
            }],
            'import/newline-after-import': ['error', {count: 1}],
            'import/no-duplicates': 'error',

            'style/max-len': ['error', {
                code: 100,
                tabWidth: 2,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
                ignoreComments: true,
                ignorePattern: '^\\s*@apply\\b',
            }],
            'style/indent': ['error', 2],
            'style/semi': ['error', 'always'],
            'style/semi-style': ['error', 'last'],
            'style/quotes': ['error', 'double', {allowTemplateLiterals: true, avoidEscape: false}],
            'style/quote-props': ['error', 'as-needed'],
            'style/jsx-quotes': ['error', 'prefer-double'],
            'style/comma-dangle': ['error', 'always-multiline'],
            'style/comma-style': ['error', 'last'],
            'style/object-curly-spacing': ['error', 'always'],
            'style/jsx-closing-bracket-location': ['error', {
                nonEmpty: 'tag-aligned',
                selfClosing: 'after-props',
            }],
            'style/arrow-parens': ['error', 'always'],

            '@typescript-eslint/no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            }],

            '@typescript-eslint/no-explicit-any': 'off'
        },
    },

    // Special rules for SVG/Image Vue components
    {
        files: ['**/assets/**/*.vue', '**/svg/**/*.vue', '**/images/**/*.vue'],
        rules: {
            'style/max-len': 'off', //// Disable max-len for SVG files
        },
    },
    ...storybook.configs["flat/recommended"]
];