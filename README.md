# grunt-sweet.js

> Grunt plugin for Sweet.js

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-sweet.js --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-sweet.js');
```

## The "sweetjs" task

### Overview
In your project's Gruntfile, add a section named `sweetjs` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  sweetjs: {
    options: {
      modules: ['sparkler/macros', 'adt-simple/macros'],
      readableNames: true
    },
    // Compiles to .js or .built.js files
    target_1: {
      src: 'files/*.sjs'
    },
    // Compiles to a combined file
    target_2: {
      src: 'files/*.sjs',
      dest: 'out.js'
    },
    // Compiles to a directory
    target_3: {
      src: 'files/*.sjs',
      dest: 'out/'
    }
  },
})
```

### Options

#### options.modules
Type: `Array`
Default value: []

A list of macros you want to use. These can be npm modules or local files. Analagous to the `sjs -m` option.

#### options.sourceMap
Type: boolean
Default value: false

Generate sourcemaps along with JavaScript files

#### options.nodeSourceMapSupport
Type: boolean
Default value: false

Automatically load the
[source-map-support](https://github.com/evanw/node-source-map-support)
node module in generated files so errors automatically use sourcemaps. (You need to install the module with `npm install source-map-support`)

#### options.readableNames
Type: boolean
Default value: false

Cleans up the hygienic renames that sweet.js generates. Currently only supports ES5 code.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

*v0.1.5 (2014-6-23)*
*    Updated with latest sweet.js
*    Added compile to directory option

*v0.1.4 (2014-1-16)*
*    Support for the `readableNames` options

*v0.1.3 (2014-1-11)*
*    Updates for sweet.js 0.4.x
*    Much faster compilation for many files

*v0.1.2 (2013-12-13)*
*    Source map support
*    Changed task name to `sweetjs`
*    Individually build files (just use a `src` on your target)

*v0.1.0 (2013-11-17)*
*    Initial release
