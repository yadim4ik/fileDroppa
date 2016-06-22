var helpers = require('./helpers');

module.exports = {
    devtools: 'source-map',

    resolve: {
        extensions: ['', '.ts', '.js']
    },

    module: {
        preLoaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: [helpers.root('node_modules')]
            }
        ],
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'null'
            }
        ],

        tslint: {
            emitErrors: false,
            failOnHint: false,
            resourcePath: 'components'
        }
    }
};