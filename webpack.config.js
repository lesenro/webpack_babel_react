//路径相关
const path = require('path');
//文件复制插件
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 处理html文件，生成index.html
const HtmlWebpackPlugin = require('html-webpack-plugin');
//打包前清理旧的打包目录
const CleanWebpackPlugin = require('clean-webpack-plugin');
//删除精简导出的代码
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
//webpack对象
const webpack = require('webpack');
//配置合并
const merge = require('webpack-merge');
//公用文件存放位置
const ASSET_PATH = '/asset/';
//分离css文件
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//通用配置
const common = {
    entry: {
        bundle: ["babel-polyfill", './src/index.jsx'],
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [{
            test: /\.(jsx|js)?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react', "stage-0"],
                    plugins: [
                        'transform-decorators-legacy',
                        ["import", { libraryName: "antd", libraryDirectory: "es", style:true }] // `style: true` 会加载 less 文件
                    ]
                }
            }
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name(file) {
                        return `${ASSET_PATH}img/[hash:8].[ext]`
                    }
                }
            }

            ]
        }]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: "./public",
            to: path.resolve(__dirname, 'dist')
        }]),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
    ],
    output: {
        filename: '[name].[chunkHash:8].js',
        chunkFilename: "[name].[chunkHash:8].js",
        path: path.resolve(__dirname, 'dist'),
    }
};
//开发环境
const dev = merge(common, {
    module: {
        rules: [{
            test: /\.less$/,
            use: ['style-loader', 'css-loader', {
                loader: "less-loader",
                options: {
                    javascriptEnabled: true
                }
            }]
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },]
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
        historyApiFallback: true,
        port: 8080
    }
});
//生产环境
const prod = merge(common, {
    entry: {
        vendor: ["react", "react-dom", "react-document-title", "react-router-config", "react-router-dom",
            "mobx", "mobx-react", "isomorphic-fetch", "qs", "moment","lodash"]
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                    loader: 'css-loader',
                    options: { minimize: true }
                }, {
                    loader: "less-loader",
                    options: {
                        javascriptEnabled: true
                    }
                }]
            })
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: {
                    loader: 'css-loader',
                    options: { minimize: true }
                }
            })
        },]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new ExtractTextPlugin(`${ASSET_PATH}css/style.[hash:8].css`),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'],
        }),
        new UglifyJSPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': "'production'",
        }),
    ]
});

module.exports = env => {
    if (env && env.production) {
        return prod;
    } else {
        return dev;
    }
};