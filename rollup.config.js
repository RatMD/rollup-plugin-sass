
const typescript = require('@rollup/plugin-typescript');

module.exports = {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/rollup-sass.js',
            format: 'cjs'
        },
        {
            file: 'dist/rollup-sass.mjs',
            format: 'es'
        }
    ],
    external: [
        'fs', 'path', '@rollup/pluginutils'
    ],
    plugins: [
        typescript()
    ]
};
