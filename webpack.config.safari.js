var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        bundle: "./src/safari/index.ts",
        injected: "./src/safari/injected.ts",
        oauth: "./src/safari/oauth.ts"
    },
    output: {
        path: './dist/AddToPocket.safariextension',
        filename: "[name].js"
    },

    resolve: {
        extensions: ['', '.ts', '.tsx', '.js', '.jsx']
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: ['bundle']
        }),
        new CopyWebpackPlugin([
            {from: 'src/safari/assets/'},
            {from: 'images/random-38.png'},
            {from: 'images/notAdded-38.png'},
            {from: 'src/common/assets/'}
        ])
    ]
};