import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'
import { globalIgnores } from 'eslint/config'

export default [
  // ignore build output
  globalIgnores(['dist']),

  // base JS + TS rules (flat presets)
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // react plugins (flat presets)
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.vite,

  // your project-specific settings + run Prettier as a rule
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // turn off rules that conflict with Prettier — keep this LAST
  eslintConfigPrettier,
]
