var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
module.exports = {

    entry: "./src/js/index.js", //relative to root of the application
    output: {
        filename: "./bundle.js",
        path: path.resolve(__dirname, 'dist'),
    },

    // watch:true,    



    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'img/',
                        publicPath: 'img/'
                    }
                }],
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src']
                    }
                }
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: './src/index.html',
            filename: './index.html' //relative to root of the application
        })
    ]

}