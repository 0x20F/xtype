const path  = require('path')
const hwp   = require('html-webpack-plugin')
const hwrp  = require('html-replace-webpack-plugin')
const mp    = require('mini-css-extract-plugin')
const cp    = require('copy-webpack-plugin')
const { CleanWebpackPlugin: cleanWebpackPlugin } = require('clean-webpack-plugin')

const info = {
    title: 'xtype',
    description: 'Multiplayer typeracer',
    background: '#ffffff',
    theme: '#ffffff'
}


module.exports = (env, argv) => {

    let dev = argv.mode === 'development'

    return {
        entry: path.resolve(__dirname, 'src') + '/index.js',

        output: {
            path: path.resolve(__dirname, 'public'),
            filename: dev ? 'bundle.js' : '[contenthash].js'
        },

        resolve: {
            extensions: ['.jsx', '.js', '.scss', '.html', '*'],
            alias: {
                'components'  : path.resolve(__dirname, 'src/app/components'),
                'pages'       : path.resolve(__dirname, 'src/app/pages'),
                'foundation'  : path.resolve(__dirname, 'src/app/foundation'),
                'support'     : path.resolve(__dirname, 'src/app/support'),
                'styles'      : path.resolve(__dirname, 'src/styles'),
                'assets'      : path.resolve(__dirname, 'src/assets')
            }
        },

        devServer: {
            historyApiFallback: true
        },

        module: {
            rules: [
                {
                    test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'fonts/'
                            }
                        }
                    ]
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.html$/,
                    use: {
                        loader: 'html-loader'
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        mp.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/images'
                    }
                }
            ]
        },

        plugins: [
            new hwp({
                template: path.resolve(__dirname, 'src/index.html'),
                filename: 'index.html'
            }),

            new hwrp([
                {
                    pattern: '_DESC_',
                    replacement: info.description
                },
                {
                    pattern: '_TITLE_',
                    replacement: info.title
                }
            ]),

            new mp({
                filename: '[hash].css'
            }),

            new cp({
                patterns: [
                    { from: 'src/data', to: 'data' }
                ]
            }),

            new cleanWebpackPlugin()
        ]
    }
}
