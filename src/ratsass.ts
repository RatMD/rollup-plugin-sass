
import path from 'path';
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
    const _getConfig =
     function () {
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
        includes.push(path.dirname(id));

        // Attach Watchers
        if (this.meta.watchMode) {
            if ('watch' in config) {
                let files = (Array.isArray(config.watch)? config.watch: [config.watch]) as string[];
                files.forEach((file) => this.addWatchFile(file));
            } else {
                this.addWatchFile(path.dirname(id));
            }
        }

        // Handle FileNameHandler
        let emitAsset: EmittedAsset; 
        if (typeof config.fileNames !== 'undefined') {
            let fileName = typeof config.fileNames === 'function' ?
                config.fileNames(path.basename(id), id) :
                config.fileNames;
            
            let emitName = path.basename(id).split('.');
            emitName.pop();

            emitAsset = {
                type: 'asset',
                fileName: fileName.replace(/\[name\]/g, emitName.join('.')).replace(/\[extname\]/g, '.css'),
                name: emitName.join('.'),
                source: code
            };
        } else {
            let emitName = path.basename(id).split('.');
            emitName[emitName.length-1] = 'css';

            emitAsset = {
                type: 'asset',
                name: emitName.join('.'),
                source: code
            };
        }

        // Handle Styles
        if (!config.bundle) {
            this.emitFile(emitAsset);
        } else {
            if (typeof chunks.reference === 'undefined') {
                emitAsset.source = '@bundle';
                chunks.reference = this.emitFile(emitAsset);
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
