/*
 * grunt-sweet.js
 * https://github.com/natefaubion/grunt-sweet.js
 *
 * Copyright (c) 2013 Nathan Faubion
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var moduleCache = {};
  var sweet = require('sweet.js');

  grunt.registerMultiTask('sweet_js', 'Sweeten your JavaScript', function() {
    var options = this.options({
      modules: []
    });

    var moduleSrc = options.modules.map(function(m) {
      return moduleCache[m] || (moduleCache[m] = readModuleFromCwd(m));
    }).join('\n');

    this.files.forEach(function(f) {
      var src = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        return grunt.file.read(filepath);
      }).join('\n');

      grunt.file.write(f.dest, sweet.compile(moduleSrc + '\n' + src));
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

  // Mocks a module in the cwd so it can find the path to the installed module.
  // If we just used `require.resolve` it would try to load it relative to
  // this module, which is not what we want. Lifted from the sjs bin.
  function readModuleFromCwd(mod) {
    var cwd = process.cwd();
    var Module = module.constructor;
    var mockModule = {
      id: cwd + '/$sweet-loader.js',
      filename: '$sweet-loader.js',
      paths: /^\.\/|\.\./.test(cwd) ? [cwd] : Module._nodeModulePaths(cwd)
    };
    var path = Module._resolveFilename(mod, mockModule)
    return grunt.file.read(path);
  }
};
