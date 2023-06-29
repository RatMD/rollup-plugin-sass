
const typescript = require('@rollup/plugin-typescript');

// Export Module
module.exports = (config) => {
    if (typeof config.skipIntro === 'undefined' || !config.skipIntro) {
        console.log("\x1b[33m              _      ");
        console.log("             | |     ");
        console.log("    _ __ __ _| |_    ");
        console.log("   | '__/ _` | __|   ");
        console.log("   | | | (_| | |_    ");
        console.log("   |_|  \\__,_|\\__|  \x1b[43m\x1b[30m rat.md ");
        console.log("\x1b[0m");
    }
    delete config.skipIntro;

    // Return Bundle
    return {
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
    }
};
