var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        bundle: "./src/chrome/index.ts",
        //       oauth: "./src/safari/oauth.ts"
    },
    output: {
        path: './dist/AddToPocket.chrome',
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
            {from: 'src/chrome/assets/'},
            {from: 'images/notAdded-38.png'},
            {from: 'images/added-38.png'},
            {from: 'images/notAdded-19.png'},
            {from: 'images/added-19.png'},
            {from: 'src/common/assets/'}
        ])
    ]
};