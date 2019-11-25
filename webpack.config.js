var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    
    entry: "./src/js/index.js", //relative to root of the application
    output: {
        filename: "./bundle.js" //relative to root of the application
    },

   // watch:true,    


	
    module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
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
