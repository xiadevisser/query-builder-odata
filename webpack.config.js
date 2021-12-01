const path = require('path');
const DtsBundleWebpack = require('dts-bundle-webpack');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    main: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js',
    library: {
      type: 'umd'
    },
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  plugins: [
    new DtsBundleWebpack({
      name: 'query-builder-odata',
      main: 'dist/**/*.d.ts',
      out: 'index.d.ts',
      removeSource: true,
      outputAsModuleFolder: true,
    }),
  ],
  optimization: {
    minimize: true,
  },
};
