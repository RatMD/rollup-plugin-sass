
import { basename, dirname } from 'path';
import { EmittedAsset, OutputBundle, OutputOptions, OutputPlugin, SourceDescription } from 'rollup';
import { createFilter } from '@rollup/pluginutils';

import output from './ratsass-output';
import { RatSassPluginConfig } from './types/ratsass.d';

/**
 * Rollup Plugin
 * @param config 
 * @returns 
 */
function build(config: RatSassPluginConfig = { }) {
    const filter = createFilter(config.include || ['**/*.css', '**/*.scss', '**/*.sass'], config.exclude);
    const chunks = { length: 0, reference: undefined };
    const includes = config.includePaths || ['node_modules'];
    includes.push(process.cwd());

    // Get Bundle Function
    const _getBundle = function () {
        let result = '';
        for (let i = 0; i < chunks.length; i++) {
            result += chunks[i];
        }
        return result;
    };
    
    // Get Configuration Function
    const _getConfig = function () {
        return config;
    };
    
    // Get Includes Function
    const _getIncludes = function () {
        return includes;
    };

    // Transform Function
    const transform = function (code: string, id: string): SourceDescription {
        if (!filter(id)) {
            return;
        }
        includes.push(dirname(id));

        // Attach Watchers
        if ('watch' in config) {
            let files = (Array.isArray(config.watch)? config.watch: [config.watch]) as string[];
            files.forEach((file) => this.addWatchFile(file));
        }

        // Handle FileNameHandler
        if (typeof config.fileNames !== 'undefined') {
            if (typeof config.fileNames === 'function') {
                config.fileNames = config.fileNames(basename(id), id);
            }
            let emitname = basename(id).split('.');
            emitname.pop();

            var emitdata: EmittedAsset = {
                type: 'asset',
                fileName: config.fileNames.replace(/\[name\]/g, emitname.join('.')).replace(/\[extname\]/g, '.css'),
                name: emitname.join('.'),
                source: code
            };
        } else {
            let emitname = basename(id).split('.');
            emitname[emitname.length-1] = 'css';

            var emitdata: EmittedAsset = {
                type: 'asset',
                name: emitname.join('.'),
                source: code
            };
        }

        // Handle Styles
        if (!config.bundle) {
            this.emitFile(emitdata);
        } else {
            if (typeof chunks.reference === 'undefined') {
                emitdata.source = '@bundle';
                chunks.reference = this.emitFile(emitdata);
            }
            chunks[chunks.length++] = code;
        }
        return {
            code: '',
            map: { mappings: '' }
        };
    };

    // generateBundle Function
    const generateBundle = function (options: OutputOptions, bundle: OutputBundle, isWrite: boolean) {
        let skipOutput = false;
        if (typeof options.plugins !== 'undefined' && Array.isArray(options.plugins)) {
            skipOutput = typeof options.plugins.find(
                (plugin: OutputPlugin) => plugin.name === 'rat-sass-output'
            ) !== 'undefined';
        }

        // Generate Bundle
        if (!skipOutput) {
            let result = output(config);
            result._setInstance({ _getBundle }, includes);
            result.generateBundle.call(this, options, bundle, isWrite);
        }
    };

    // Return Rollup Plugin
    return {
        name: "rat-sass",
        transform,
        generateBundle,

        // Custom Functions
        _getBundle,
        _getConfig,
        _getIncludes
    };
}

// Export Module
export default build;
