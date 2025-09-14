/* .eslintrc.cjs */
module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    project: null,
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    },
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'jsx-a11y', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
  ],
  rules: {
    // React + TS
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',

    // 🔧 per no encallar-nos ara en estil/noise
    '@typescript-eslint/no-explicit-any': 'off',
    'import/order': 'off',
    'react/no-unescaped-entities': 'off',

    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true,
    }],

    // A11Y: els mantenim estrictes
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/no-static-element-interactions': ['error', { allowExpressionValues: true }],
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either', depth: 3 }],
    'jsx-a11y/no-autofocus': ['warn', { ignoreNonDOM: true }],
    'jsx-a11y/no-noninteractive-element-interactions': 'error',
    'jsx-a11y/interactive-supports-focus': 'warn',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'warn',
  },
};