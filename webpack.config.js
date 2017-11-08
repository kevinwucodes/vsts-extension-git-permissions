const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const buildDir = path.resolve(__dirname, 'build')

module.exports = {
  target: 'web',

  entry: {
    app: './src/index.js'
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'scripts/[name].js'
    // libraryTarget: 'amd'
  },

  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }]
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

  externals: [
    {
      react: 'React',
      'react-dom': 'ReactDOM',
      axios: 'axios'
    },
    /^VSS\/.*/,
    /^TFS\/.*/
  ],

  plugins: [
    new CopyWebpackPlugin([
      {
        from: './static',
        to: `${buildDir}`
      },
      {
        from: './vss-extension.json',
        to: `${buildDir}`
      },

      //copy VSS lib
      {
        from: './node_modules/vss-web-extension-sdk/lib/VSS.SDK.min.js',
        to: `${buildDir}/libs/VSS.SDK.min.js`
      },
      {
        from: './node_modules/vss-web-extension-sdk/lib/VSS.SDK.js',
        to: `${buildDir}/libs/VSS.SDK.js`
      },

      //copy libs from vendors
      {
        from: './node_modules/react/umd/react.production.min.js',
        to: `${buildDir}/libs/react.production.min.js`
      },
      {
        from: './node_modules/react-dom/umd/react-dom.production.min.js',
        to: `${buildDir}/libs/react-dom.production.min.js`
      },
      {
        from: './node_modules/axios/dist/axios.min.js',
        to: `${buildDir}/libs/axios.min.js`
      }
    ])
  ]
}
