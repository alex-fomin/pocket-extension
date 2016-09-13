module.exports = {
    entry: "./src/index.ts",
    output: {
        path: './dist/',
        filename: "bundle.js"
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
    }
};