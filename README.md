@rat.md / rollup-plugin-sass - Rollup SASS Extension
====================================================
A SASS / SCSS Compiler and Bundler Plugin for [rollup](https://rollupjs.org), especially designed 
for our own rat and tail products and packages. It supports source maps, relative source map source 
URLs, separate stylesheets for middleware developers and many more neat features.

This package is inspired by [thgh/rollup-plugin-scss](https://github.com/thgh/rollup-plugin-scss), 
but is designed especially for package developers, who want to provide multiple stylesheets for 
their products and packages.


Differences to [thgh/rollup-plugin-scss](https://github.com/thgh/rollup-plugin-scss) v2 / v3
----------------------------------------

-   Support for SourceMaps (+ relative SourceMap Source URLs).
-   Support for separate but also bundled stylesheets.
-   Uses the Rollup Native assets environment and a bunch of configurations.
-   Adds a few more options, such as banner and footer.
-   Requires node.js version 14.13.0 or above.
-   Written in TypeScript.
-   Does not support using other SASS libraries (DartSASS is the only supported lib).
-   Fails on error per default.
-   Skipping SASS imports must be done with `.skip()` instead of `output: false`.


Installation
------------

-   **Tested** with Rollup 3.x only

Get the latest version of our Rat SASS Rollup Plugin using npm or yarn:

```
npm install --save-dev @rat.md/rollup-plugin-sass
```

```
yarn add --dev @rat.md/rollup-plugin-sass
```


Usage
-----

The `@rat.md/rollup-plugin-sass` package exports 3 rollup plugins: 

-   `.build()`, the main SASS compiler / handler
-   `.output()`, an additional output plugin handler
-   `.skip()`, an SASS import skipper / ignore handler

The `.build()` plugin can only be used in the outer scoped `plugins` configuration object and will 
take over the whole SASS handling including the output generation / bundling, unless the additional 
`.output()` plugin is available in the inner scoped `output.plugins` configuration set. This allows 
you to generate different CSS stylesheets on all your defined outputs, ex.: creating a minified and 
unminified stylesheet.

The additional `.skip()` handler can also only be used in the outer space `plugins` object and 
allows to just strip all respective style-imports.


### Usage of .build()

The `.build()` plugin does the main magic and also generates the desired output directly, unless the 
`.output()` plugin is passed in the inner scoped `output.plugins` rollup definition.

```javascript
import rat from '@rat.md/rollup-plugin-sass';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/script.js',
        format: 'cjs'
    },
    plugins: [
        rat.build()
    ]
};
```


### Usage of .output()

The `.output()` plugin allows you to adapt the css compilation per rollup output definition and can 
ONLY be used together with `.build()` as outer-scoped plugin.

```javascript
import rat from '@rat.md/rollup-plugin-sass';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/script.js',
            format: 'cjs',
            plugins: [
                rat.output(
                    /* Provide output-related options */
                )
            ]
        },
        {
            file: 'dist/script.min.js',
            format: 'cjs',
            plugins: [
                rat.output(/* Provide output-related options */ {
                    outputStyle: 'compressed'
                }),
                terser()
            ]
        }
    ],
    plugins: [
        rat.build(/* Provide Basic options */)
    ]
};
```


### Usage of .skip()

The `.skip()` package will just ignore all stylesheet imports, useful if you need to export multiple 
versions of your JavaScript on multiple rollup definitions, without re-compiling the same 
stylesheets again.

```javascript
import rat from '@rat.md/rollup-plugin-sass';

export default [
    {
        input: 'src/index.js',
        output: {
            file: 'dist/script.js',
            format: 'cjs'
        },
        plugins: [
            rat.sass()
        ]
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/script.js',
            format: 'es'
        },
        plugins: [
            rat.skip()
        ]
    }
];
```


Configuration
-------------

### banner
> Available for: `.build()` and `.output()`<br>
> Types: `string | (name: string) => string`

Adds an additional banner on top of your (bundled) stylesheets. You can use either a hardcoded 
string (don't forget to use the comment syntax) or a function, which receives the current stylesheet 
filename and which MUST return a string.


### bundle
> Available for: `.build()`<br>
> Types: `boolean`

The **rat.sass** rollup plugin doesn't bundle your stylesheets per default, so each included SASS or 
SCSS file within your JavaScript or TypeScript project will be compiled into an own file. This 
option allows you to force the bundeling of all included stylesheets into one single .css file, 
including one single SourceMap too, of course.


### exclude
> Available for: `.build()` and `.skip()`<br>
> Types: [`picomatch`](https://github.com/micromatch/picomatch#globbing-features)

Rollup filter configuration: A valid [picomatch](https://github.com/micromatch/picomatch#globbing-features) 
pattern, or array of patterns. If `options.include` is omitted or has a length of zero, filter will 
return true by default. Otherwise, an ID must match one or more of the picomatch patterns, and must 
not match any of the options.exclude patterns.


### fileNames
> Available for: `.build()`<br>
> Types: `string | (name: string, id: string) => string`

Allows you to overwrite the default used `rollup.assetFileNames` option, which defines where and 
with which name scheme the stylesheets will be stored / bundled. This option allows you to use the 
following placeholders:

-   `[extname]`: The file extension without leading dot: `css` or `min.css`
-   `[name]`: The name of the imported stylesheet without any extension

Keep in mind, that this cannot be a relative or absolute path (see [rollup#3507](https://github.com/rollup/rollup/issues/3507)). 
The according files will be written within the bundled root directory, which is defined by 
`output.dir`. If you're using `output.file` you should consider to switch to `output.dir` with
`output.entryFileNames` instead which leads to the same result when used correctly.


### footer
> Available for: `.build()` and `.output()`<br>
> Types: `string | (name: string) => string`

Adds an additional footer on the bottom of your (bundled) stylesheets but BEFORE the sourceMapUrl 
comment. You can use either a hardcoded string (don't forget to use the comment syntax) or a 
function, which receives the current stylesheet filename and which MUST return a string.


### include
> Available for: `.build()` and `.skip()`<br>
> Types: [`picomatch`](https://github.com/micromatch/picomatch#globbing-features)

Rollup filter configuration: A valid [picomatch](https://github.com/micromatch/picomatch#globbing-features) 
pattern, or array of patterns. If `options.include` is omitted or has zero length, filter will 
return true by default. Otherwise, an ID must match one or more of the picomatch patterns, and must 
not match any of the options.exclude patterns.


### minifiedExtension
> Available for: `.build()` and `.output()`<br>
> Types: `boolean`

True will automatically turn `.css` extensions into `.min.css` if the `outputStyle` option is set 
to `compressed`, which is really helpful for bundle generations on 2-styled outputs.


### prefix
> Available for: `.build()` and `.output()`<br>
> Types: `string | (name: string) => string`

Adds additional SASS / SCSS / CSS content to each stylesheet, before they get compiled. Very useful 
to add some variables or mixins. You can use either a hardcoded string or a function, which receives 
the current stylesheet filename and which MUST return the prefix content as string.


### preprocess
>   Available for: `.build()` and `.output()`<br>
>   Types: `(file: OutputAsset, config: RatSassOutputConfig, options: OutputOptions, bundle: OutputBundle) => OutputAsset`

Adds a hook on the top of the main `generateBundle` method, which allows you to modify the output 
asset.


### postprocess
>   Available for: `.build()` and `.output()`<br>
>   Types: `(file: OutputAsset, config: RatSassOutputConfig, options: OutputOptions, bundle: OutputBundle) => OutputAsset`

Adds a hook on the bottom of the main `generateBundle` method, which allows you to modify the output 
asset.


### sourceMapUrls
> Available for: `.build()` and `.output()`<br>
> Types: `boolean | string | (url: string) => string`

Allows you to turn the absolute paths, generated by the DartSASS sourcemap generator, into relative 
ones. You can either pass `true`, which will autodetect a relative path considering the sourceMapRoot 
option if passed, `false` to keep the absolute paths, a fixed string which will be used to replace 
the absolute part of the URL with the relative one or a function, which receives the absolute URLs 
and should return the relative ones as string. 

Using `true` will also replace the inital `stdin` (used for the main imported stylesheet files) with 
the stylesheet relative path itself. Beware, that your callback function will receive the `stdin` 
input as well.


### watch
> Available for: `.build()`<br>
> Types: `string | string[]`

You can pass a single or multiple file or directory paths to be monitored in watch mode, which 
triggers the rollup build function on each change of these files.


### SASS Configuration
> Available for: `.build()` and `.output()`

The following SASS options are available on the latest published version, keep in mind that 
**rat.sass** uses **DartSass** and is not compatible nor configurable for the NodeSass, LibSass or 
RubySass packages.


#### includePaths

Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#includepaths) for more 
information.


#### indentedSyntax

Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#indentedsyntax) for 
more information.


#### indentType

Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#indenttype) for more 
information.


#### indentWidth

Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#indentwidth) for more 
information.


#### linefeed

Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#linefeed) for more 
information.


#### omitSourceMapUrl

Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#omitsourcemapurl) for 
more information.


#### outFile

This option should be avoided whenever possible, since **rat.sass** pushes this option based on the used 
rollup configuration. Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#outfile) 
for more information.


#### outputStyle

The default value for this option is based on the [`output.compact`](https://rollupjs.org/guide/en/#outputcompact) 
rollup configuration. Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#outputstyle) 
for more information.


#### sourceComments

Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#sourcecomments) for 
more information.


#### sourceMap

The default value for this option is based on the [`output.sourcemap`](https://rollupjs.org/guide/en/#outputsourcemap) 
rollup configuration. Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#sourcemap) 
for more information.


#### sourceMapContents

The default value for this option is based on the [`output.sourcemapExcludeSources`](https://rollupjs.org/guide/en/#outputsourcemapexcludesources) 
rollup configuration. Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#sourcemapcontents) 
for more information.


#### sourceMapEmbed

The default value for this option is based on the [`output.sourcemap`](https://rollupjs.org/guide/en/#outputsourcemap) 
rollup configuration. Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#sourcemapembed) for 
more information.


#### sourceMapRoot

Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#sourcemaproot) for more 
information.


Copyright & License
-------------------
Written by SamBrishes \<sam@rat.md\> - [rat.md](https://www.rat.md).

> Published under the MIT license<br />
> Copyright &copy; 2021 - 2023 rat.md \<info@rat.md\>.<br />
> Copyright &copy; 2020 - 2021 pytesNET \<info@pytes.net\>.