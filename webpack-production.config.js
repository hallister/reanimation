var path = require('path');
var webpack = require('webpack');
var pjson = require('./package.json');

var PROD = JSON.parse(process.env.PROD_DEV || "0");

var name = pjson.name + '-' + pjson.version;

var externals = [];
externals.push(/^react(\/.*)?$/, /^react-dom(\/.*)?$/);


module.exports = {
    entry: './index.js',
    externals: externals,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: PROD ?  name + '.min.js' : name + '.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: PROD ? [
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ] : [],
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
};