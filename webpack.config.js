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
//通用配置
const common = {
    entry: {
        app: './src/index.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.(jsx|js)?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react', "stage-2"]
                    }
                }
            }, {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name(file) {
                                return '[path][hash].[ext]'
                            }
                        }
                    }

                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: "./public",
                to: path.resolve(__dirname, 'dist')
            }
        ]),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        })
    ],
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, 'dist'),
    }
};
//开发环境
const dev = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
        historyApiFallback: true,
        port:8080
    }
});
//生产环境
const prod = merge(common, {
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new UglifyJSPlugin()
    ]
});

module.exports = env => {
    if (env && env.production) {
        return prod;
    } else {
        return dev;
    }
};