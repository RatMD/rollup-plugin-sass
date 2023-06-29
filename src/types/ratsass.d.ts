
import { SassConfig } from './sass.d';
import { OutputAsset, OutputBundle, OutputOptions } from 'rollup';

export declare interface RatSassBasicConfig {
    /*
     |  EXCLUDE FILE FILTER
     |  @since          0.1.0
     |
     |  @values
     |      string      
     |      RegExp      
     |      Array       
     */
    exclude?: string | RegExp | Array<string | RegExp>;

    /*
     |  INCLUDE FILE FILTER
     |  @since          0.1.0
     |
     |  @values
     |      string      
     |      RegExp      
     |      Array       
     */
    include?: string | RegExp | Array<string | RegExp>;
}

export declare interface RatSassOutputConfig extends RatSassBasicConfig, SassConfig {
    /*
     |  BANNER TO USE ON STYLESHEET
     |  @since          0.1.0
     |
     |  @values
     |      string      A banner text, which sould prepend the compiled stylesheet.
     |      function    A function receiving the base filename and the OutputAsset, must return the banner string.
     */
    banner?: string | ((name: string, file: OutputAsset) => string);

    /*
     |  FOOTER TO USE ON STYLESHEET
     |  @since          0.1.0
     |
     |  @values
     |      string      A footer text, which sould append the compiled stylesheet (but before the linked SourceMap).
     |      function    A function receiving the base filename and the OutputAsset, must return the footer string.
     */
    footer?: string | ((name: string, file: OutputAsset) => string);

    /*
     |  USE .MIN.CSS ON COMPRESSED OUTPUTs
     |  @since  0.3.0
     |
     |  @values
     |      boolean     TRUE (default) to add .min.css on compressed styles, FALSE to do it not.
     */
    minifiedExtension?: boolean;

    /*
     |  PREFIX SOME CONTENT
     |  @since          0.1.0
     |
     |  @values
     |      string      The SASS / SCSS / CSS content to prefix before compiling.
     |      function    A function returning the content to prefix before compiling.
     */
    prefix?: string | ((name: string, file: OutputAsset) => string);

    /*
     |  OUTPUT ASSET PRE-PROCESSING HOOK
     |  @since          0.3.0
     |
     |  @values
     |      function        A function which allows you to preprocess the OutputAsset Bundle.
     */
    preprocess?: (file: OutputAsset, config: RatSassOutputConfig, options: OutputOptions , bundle: OutputBundle) => OutputAsset;
    
    /*
     |  OUTPUT ASSET POST-PROCESSING HOOK
     |  @since          0.3.0
     |
     |  @values
     |      function        A function which allows you to postprocess the OutputAsset Bundle.
     */
    postprocess?: (file: OutputAsset, config: RatSassOutputConfig, options: OutputOptions , bundle: OutputBundle) => OutputAsset;

    /*
     |  PREPROCESs SOURCEMAP SOURCE URLs
     |  @since          0.1.0
     |
     |  @values
     |      string      A simple string pointing to the desires SASS directory (don't forget your sourceMapRoot value).
     |      boolean     TRUE tries to resolve all absolute paths to relative ones, FALSE will not touch the sourceMapUrls at all.
     |      Function    A function which receives the absolute path and should return the relative one.
     */
    sourceMapUrls?: boolean | string | ((url: string) => string);
}

export declare interface RatSassPluginConfig extends RatSassOutputConfig {
    /*
     |  BUNDLE STYLESHEETs
     |  @since          0.1.0
     |
     |  @values
     |      bool        TRUE to bundle all included stylesheet in one file, FALSE to store them separately.
     */
    bundle?: boolean;

    /*
     |  OUTPUT FILE NAMEs
     |  @since          0.1.0
     |
     |  @values
     |      string      The output filenames for the stylesheets, will overwrite rollup's assetFileNames option.
     |      function    A function which received the basename and the full id as string and MUST return the used one.
     */
    fileNames?: string | ((name: string, id: string) => string);

    /*
     |  WATCHER
     |  @since          0.1.0
     |
     |  @values
     |      string      
     |      string[]    
     */
    watch?: string | string[];
}

export declare interface RatSassRenderedChunk {
    css: string,
    map?: string
}

export declare interface RatSassErrorHandler {
    error: string,
    position?: { column: number; line: number }
}
