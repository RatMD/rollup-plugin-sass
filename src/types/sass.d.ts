
export declare interface SassConfig {
    /*
     |  THE STYLES, WHICH SHOULD BE COMPILED
     */
    data?: null | string;

    /*
     |  THE PATHS, WHERE THE SASS COMPILER LOOKS FOR IMPORTED MODULEs
     */
    includePaths?: string[];

    /*
     |  USE SASS' ORIGINAL INTENDATION SYNTAX
     */
    indentedSyntax?: boolean;

    /*
     |  OUTPUT INDENT TYPE
     */
    indentType?: 'space' | 'tab';

    /*
     |  OUTPUT INTEND WIDTH
     */
    indentWidth?: number;

    /*
     |  OUTPUT LINE ENDING FORMAT
     */
    linefeed?: 'lf' | 'lfcr' | 'cr' | 'crlf';

    /*
     |  OMIT THE SOURCE LINK ON THE OUTPUT STYLESHEET
     */
    omitSourceMapUrl?: boolean;

    /*
     |  OUTPUT FILE USED FOR THE SOURCEMAP NOT FOR WRITING THE FILE ACTUALLY
     */
    outFile?: string;

    /*
     |  OUTPUT STYLE 
     */
    outputStyle?: 'expanded' | 'compressed';

    /*
     |  OUTPUT COMMENT EACH STYLE RULE WITH ITS LOCATION
     */
    sourceComments?: boolean;

    /*
     |  OUTPUT SOURCEMAP 
     */
    sourceMap?: boolean | string;

    /*
     |  EMBED THE ENTIRE STYLE CONTENT IN THE SOURCEMAP
     */
    sourceMapContents?: boolean;

    /*
     |  EMBED THE SOURCEMAP IN THE STYLESHEET FILE
     */
    sourceMapEmbed?: boolean;

    /*
     |  PREPEND ALL SOURCEMAP URLs
     */
    sourceMapRoot?: string;
}
