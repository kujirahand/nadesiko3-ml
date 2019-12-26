const path = require('path')

const srcPath = path.join(__dirname, 'src')
const releasePath = path.join(__dirname, 'release')

process.noDeprecation = true

module.exports = {
    mode: 'development',
    entry: './src/plugin_ml.js',
    output: {
        filename: 'plugin_ml.js',
        path: releasePath
    },
    module: {
        rules: [
            {
                exclude: [/node_modules/, /libsvm\.asm\.js$/],
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    },
    node: {
        fs: "empty"
    }
}

