const path = require('path');

module.exports = {
  extends: [
    'next/core-web-vitals',
    'prettier',
    'kentcdodds/import',
    'kentcdodds/jest',
  ],
  rules: {
    'no-console': 'error',
    'import/named': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/**'],
      settings: {
        'import/resolver': {
          jest: {
            jestConfigFile: path.join(__dirname, './jest.config.js'),
          },
        },
      },
    },
  ],
};
