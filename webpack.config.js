const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = (env) => {
    return {
        entry: './src/index.ts',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts'],
        },
        plugins: [
            new Dotenv(env)
        ],
        mode: "development",
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'public/dist'),
        }
    }
};