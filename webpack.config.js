const path = require('path');

module.exports = {
    entry: './src/assets/js/main.js',
    output: {
        filename: 'app.bundle.js',
        path: path.resolve(__dirname, 'dist'),
    }
};
