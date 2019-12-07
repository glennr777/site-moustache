module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
      },
      importFrom: './src/main.css',
    },
    'postcss-for': {},
    'postcss-inline-svg': {},
    'postcss-font-magician': {},
  },
};
