const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
    entry : {
        // 'js/out.js': ['./src/js/app.js', './src/js/b.js'],
        'js/out.js': './src/js/app.js',
        'css/main.css~': './src/scss/main.scss'
    },
    output : {
        path: __dirname+'/',
        filename: '[name]'
    },
    watch: true,
    devtool: 'eval-source-map',

    module: {
        loaders:[
            {
                test:/\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query:{
                    presets:['es2015']
                }
            }
        ],
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('./css/style.css'),
        new LiveReloadPlugin()
    ]


}
