const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require("path");

module.exports = (env, argv = {}) => ({
    entry: {
        bundle: "./src/index.js"
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].js",
        publicPath: "/"
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new CleanWebpackPlugin({ verbose: true }),
        new MiniCssExtractPlugin({
            filename: argv.mode === "development" ? '[name].css' : '[name].[hash].css',
            chunkFilename: argv.mode === "development" ? '[id].css' : '[id].[hash].css',
        }),
    ],
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    resolve: {
        extensions: [".js"],
        alias: {
            actions: path.resolve(__dirname, "src/actions"),
            api: path.resolve(__dirname, "src/api"),
            app: path.resolve(__dirname, "src/app"),
            domain: path.resolve(__dirname, "src/domain"),
            reducers: path.resolve(__dirname, "src/reducers")
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.s(a|c)ss$/,
                loader: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]___[hash:base64:5]',
                            camelCase: true,
                            sourceMap: argv.mode === "development"
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: argv.mode === "development"
                        }
                    }
                ]
            },
        ]
    },
    devtool: argv.mode === "development" ? "source-map" : false,
    devServer: {
        contentBase: path.resolve(__dirname, "public"),
        publicPath: "/",
        port: 3000,
        historyApiFallback: true
    },
    externals: {
        react: "React",
        "react-dom": "ReactDOM"
    }
});