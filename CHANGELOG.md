rat.sass - Changelog
====================

Version 0.4.0
-------------
-   Update: Change rollup requirements from v2 to v3.
-   Update: Add base stylesheet directories to watch pipe, when not passed as config.
-   Bugfix: Overwrite of `config.fileNames` when passed as a function.
-   Remove: zora, our own zora reporter, and all test cases.

Version 0.3.3
-------------
-   Add: Our own custom zora test reporter.
-   Update: Remove internal `:css` suffix and directly check for `.css` extensions.
-   Bugfix: Invalid `entryFileName` on bundled stylesheets.

Version 0.3.2
-------------
-   Update: Dependencies.

Version 0.3.1
-------------
-   Bugfix: Fixed tests.
-   Bugfix: Doesn't remove the `:css` part on the asset's `fileName`.

Version 0.3.0
-------------
-   Add: The new `minifiedExtension` configuration, allows to add '.min.css' automatically.
-   Add: The new `preprocess` configuration hook to manipulate the assets on top of `generateBundle`.
-   Add: The new `postprocess` configuration hook to manipulate the assets on bottom of `generateBundle`.
-   Update: Adjust the minifiedExtension only on the end of the filename.
-   Update: Remove the `.css` extension directly on start pf `generateBundle`.
-   Update: Import the definitions on the single .ts files.
-   Upadte: The `banner`, `footer` and `prefix` options now receives the file: OutputAsset object as second parameter.
-   Bugfix: The `fileNames` option could not be a function returning a string.
-   Bugfix: The `prefix` function has been called incorrectly.
-   Bugfix: The `sourceMapUrls` function has been called incorrectly.
-   Bugfix: Wrong `sourceMapUrls` generation.

Version 0.2.0
-------------
-   Update: Update `rollup` dev dependency.
-   Update: Change `rollup-pluginutils` dependency to the new `@rollup/pluginutils`.
-   Update: Move sass constant outside plugin function.
-   Remove: Unused `InputOptions` type declaration on RatSass.
-   Bugfix: Init parent config on RatSassOutput only, if the instance is available.

Version 0.1.3
-------------
-   Hotfix: `package.json` - forget to add the `*.mjs` version of the rollup plugin.

Version 0.1.2
-------------
-   Update: Adapt `package.json` to just distribute the distribution and typings files.
-   Update: Extend `package.json` with typings index.

Version 0.1.1
-------------
-   Add: Use the `fileNames` -applied wildcards on the `banner` and `footer` options too.
-   Bugfix: The sourcemap on minified files were invalid on RatSassOutput.
-   Bugfix: RatSass configuration didn't applied on RatSassOutput.
-   Bugfix: RatSass `banner` and `footer` callback options received an invalid filename.
-   Bugfix: RatSass `footer` attached the css code again if `config.footer` is a function. 
-   Bugfix: RatSass `includePaths` didn't not find their way to RatSassOutput (`concat` failed).

Version 0.1.0
-------------
-   Initial Release
