var path = require('path');
var webpack = require('webpack');
var pjson = require('./package.json');

var externals = [];
externals.push(/^react(\/.*)?$/, /^react-dom(\/.*)?$/);

module.exports = {
    entry: './index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: pjson.name + '-' + pjson.version + '.min.js'
    },
    module: {
        loaders: [
            {
                test: /.*\/.js$/,
                loader: 'uglify',
                include: /dist/,
                exclude: /node_modules/
            },
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
};