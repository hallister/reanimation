var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './app.jsx',
    output: {
        publicPath: 'http://localhost:8080/assets',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
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