'use strict';
var webpack = require('webpack'),
    path = require('path');
var APP = path.join(__dirname, 'app');

module.exports = {
    context: APP,
    entry: {
        app: ['webpack/hot/dev-server', './core/bootstrap.js']
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        path: APP,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            }, {
                test: /\.html/,
                loader: 'raw'
            },
            {
                test: /\.(svg)(\?[\s\S]+)?$/,
                loader: 'file'
            },
            {
                test: /\.eot/,
                loader: 'url-loader?limit=100000&mimetype=application/vnd.ms-fontobject'
            },
            {
                test: /\.woff2/,
                loader: 'url-loader?limit=100000&mimetype=application/font-woff2'
            },
            {
                test: /\.woff/,
                loader: 'url-loader?limit=100000&mimetype=application/font-woff'
            },
            {
                test: /\.ttf/,
                loader: 'url-loader?limit=100000&mimetype=application/font-ttf'
            }
        ]
    }
};