const path = require('path');

module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  rules: {
    'no-console': 'error',
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
