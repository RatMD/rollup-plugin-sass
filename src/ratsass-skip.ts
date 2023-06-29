
import { OutputOptions, SourceDescription } from 'rollup';
import { createFilter } from '@rollup/pluginutils';
import { RatSassBasicConfig } from './types/ratsass.d';

/**
 * Skip Files
 * @param config 
 * @returns 
 */
function skip(config: RatSassBasicConfig = { }) {
    const filter = createFilter(config.include || ['**/*.css', '**/*.scss', '**/*.sass'], config.exclude);

    // Return Rollup Plugin
    return {
        name: 'rat-sass-skip',

        // Transform Function
        transform(code: string, id: string): SourceDescription {
            if (!filter(id)) {
                return;
            }
            return {
                code: '',
                map: { mappings: '' }
            };
        },

        // Generate Bundle Function
        generateBundle(options: OutputOptions) {
            return;
        }
    };
}

// Export Module
export default skip;
