module.exports = {
  plugins: {
    'postcss-assets': {
      loadPaths: ['/src/img/']
    },
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
    'postcss-inline-svg': {}
  },
};
