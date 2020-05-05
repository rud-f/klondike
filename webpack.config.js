const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: "development",
    entry: {
        main: "./src/app.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].[contenthash].js'
    },
    devServer: {
        port: 7000
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.png$/,
                use: ["file-loader"]
            },
        ]
    },
    plugins: [
        new HTMLWebpackPlugin,
        new CleanWebpackPlugin()
    ],

};