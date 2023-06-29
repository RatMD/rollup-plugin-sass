
import { basename } from 'path';
import { InputOptions, OutputAsset, OutputBundle, OutputOptions } from 'rollup';
import { 
    RatSassOutputConfig,
    RatSassPluginConfig, 
    RatSassRenderedChunk, 
    RatSassErrorHandler
} from './types/ratsass.d';

const sass = require('sass');

/**
 * Main Renderer Extension
 * @param config 
 * @returns 
 */
function output(config: RatSassOutputConfig = { }) {
    var instance = null;
    var includes = [process.cwd()];

    // Compile Function
    const compile = (styles: string, overwrite?: RatSassPluginConfig): RatSassRenderedChunk | RatSassErrorHandler => {
        try {
            let data = sass.renderSync(Object.assign({
                data: styles,
                includePaths: includes
            }, config, overwrite));
            data.css = data.css.toString();

            // Return
            return {
                css: data.css,
                map: (data.map || "").toString()
            };
        } catch (e) {
            if (e.line && e.column) {
                return {
                    error: e.message,
                    position: {
                        line: e.line,
                        column: e.column
                    }
                };
            } else {
                return { error: e.message };
            }
        }
    };

    // Set Instance Function
    const _setInstance = function(ratInstance, ratIncludes) {
        instance = ratInstance;
        includes = ratIncludes;
    };

    // Render Start Function
    const renderStart = function(outputOptions: OutputOptions, inputOptions: InputOptions) {
        instance = null;
        includes = [process.cwd()];

        // Get Instance
        if (typeof inputOptions.plugins[Symbol.iterator] === 'function') {
            for (let key in inputOptions.plugins as any[]) {
                if (inputOptions.plugins[key].name === 'rat-sass') {
                    instance = inputOptions.plugins[key];
                }
            }
        }

        // Handle Instance Functions
        if (instance) {
            includes = includes.concat(instance._getIncludes());
            
            let parentConfig = instance._getConfig();
            if (parentConfig) {
                for (let key in parentConfig) {
                    if (!(key in config)) {
                        config[key] = parentConfig[key];
                    }
                }
            }
        }
    };

    // Generate Bundle Function
    const generateBundle = function (options: OutputOptions, bundle: OutputBundle, isWrite: boolean) {
        if (instance === null) {
            this.error('The RatSassOutput plugin cannot be used without the RatSass plugin.');
            return;
        }

        // Trickle SourceMap Configuration
        if (typeof config.sourceMap === 'undefined') {
            config.sourceMap = options.sourcemap !== false && options.sourcemap !== 'hidden';
            if (options.sourcemap === 'inline') {
                config.sourceMapEmbed = true;
            }
            if (options.sourcemapExcludeSources) {
                config.sourceMapContents = true;
            }
        }

        // Loop Styles
        let keys = Object.keys(bundle);
        for (let name of keys) {
            if (name.indexOf('.css') !== name.length-4) {
                continue;
            }

            // Get bundled File
            let file = bundle[name] as OutputAsset;
            if (file.source === '@bundle' && instance !== null) {
                file.source = instance._getBundle();
            }

            // Preprocess File
            if (typeof config.preprocess === 'function') {
                file = config.preprocess.call(this, file, config, options, bundle);
            }

            // Justify FileName
            if (config.minifiedExtension === true || config.outputStyle === 'compressed') {
                file.fileName = file.fileName.replace(/\.css$/, '.min.css');
                file.name = file.name.replace(/\.css$/, '.min.css');
            }

            // Prefix Content
            if (typeof config.prefix !== 'undefined') {
                if (typeof config.prefix === 'function') {
                    file.source = config.prefix(file.name, file) + file.source;
                } else {
                    file.source = config.prefix + file.source;
                }
            }

            // Compile SASS
            var data = compile(file.source as string, {
                outFile: basename(file.fileName)
            });
            if ('error' in data) {
                this.error(data.error, data.position);
                continue;
            }

            // Process SourceMapUrls
            if (data.map && data.map.length > 0) {
                if (typeof config.sourceMapUrls !== 'undefined' && config.sourceMapUrls !== false) {
                    let json = JSON.parse(data.map);
                    json.sources = json.sources.map((url) => {
                        if (typeof config.sourceMapUrls === 'function') {
                            return config.sourceMapUrls.call(url);
                        } else {
                            if (url === 'stdin') {
                                url = name;
                            }
                            url = url.replace(/^file\:\/+/, '').replace(process.cwd().replace(/\\/g, '/'), '..');
                            return url;
                        }
                    });
                    data.map = JSON.stringify(json);
                }
            }

            // Add Banner
            if (typeof config.banner !== 'undefined') {
                if (typeof config.banner === 'function') {
                    var banner = config.banner(file.name, file);
                } else {
                    var banner = config.banner;
                }
                banner = banner.replace(/\[name\]/g, file.name)
                               .replace(/\[extname\]/g, (config.outputStyle === 'compressed'? '.min': '') + '.css')
                               .replace(/\[ext\]/g, 'css');
                data.css = banner + "\n" + data.css;
            }

            // Add Footer
            if (typeof config.footer !== 'undefined') {
                if (typeof config.footer === 'function') {
                    var footer = config.footer(file.name, file);
                } else {
                    var footer = config.footer;
                }
                footer = footer.replace(/\[name\]/g, file.name)
                               .replace(/\[extname\]/g, (config.outputStyle === 'compressed'? '.min': '') + '.css')
                               .replace(/\[ext\]/g, 'css');

                let offset = data.css.lastIndexOf('/*#');
                if (offset < 0) {
                    data.css += "\n" + footer;
                } else {
                    data.css = data.css.substr(0, offset) + footer + "\n" + data.css.substr(offset); 
                }
            }

            // Add Source and Hook
            file.source = data.css;
            if (typeof config.postprocess === 'function') {
                file = config.postprocess.call(this, file, config, options, bundle);
            }

            // Append Sourcemap
            if (data.map && data.map.length > 0) {
                bundle[name + '.map'] = {
                    fileName: file.fileName + '.map',
                    name: file.name + '.map',
                    source: data.map,
                    type: 'asset',
                    needsCodeReference: false
                };
            }
        }
    };

    // Return Rollup Plugin
    return {
        name: "rat-sass-output",
        renderStart,
        generateBundle,

        // Custom Functions
        _setInstance
    };
}

// Export Module
export default output;
