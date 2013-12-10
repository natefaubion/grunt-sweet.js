/*
 * grunt-sweet.js
 * https://github.com/natefaubion/grunt-sweet.js
 *
 * Copyright (c) 2013 Nathan Faubion, James Long
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var sweet = require('sweet.js');

function sweetCompile(grunt, code, dest, opts) {
  var mapfile = path.basename(dest) + '.map';

  var result = sweet.compile(code, {
    sourceMap: opts.sourceMap,
    filename: opts.filename,
    macros: opts.macros
  });

  var compiled = result.code;
  if(opts.sourceMap) {
      compiled += '\n//# sourceMappingURL=' + mapfile;
  }

  if(opts.nodeSourceMapSupport) {
    compiled = "require('source-map-support').install(); " + compiled;
  }

  grunt.file.write(dest, compiled);

  if(result.sourceMap) {
    grunt.file.write(dest + '.map', result.sourceMap, 'utf8');
  }
};

module.exports = function(grunt) {
  var moduleCache = {};

  grunt.registerMultiTask('sweet_js', 'Sweeten your JavaScript', function() {
    var task = this;
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
      });

      if(f.dest) {
        var src = src.map(function(filepath) {
          return grunt.file.read(filepath);
        }).join('\n');

        sweetCompile(grunt, src, f.dest, {
          filename: '<concatenated>',
          sourceMap: options.sourceMap,
          macros: moduleSrc,
          nodeSourceMapSupport: options.nodeSourceMapSupport
        });
      }
      else {
        src.forEach(function(filepath) {
          var outpath;
          var ext = path.extname(filepath);
          var base = path.join(path.dirname(filepath),
                               path.basename(filepath, ext));

          if(ext == '.js') {
            outpath = base + '.built.js';
          }
          else {
            outpath = base + '.js';
          }

          grunt.log.writeln('compiling ' + filepath);
          sweetCompile(grunt, grunt.file.read(filepath), outpath, {
            filename: filepath,
            sourceMap: options.sourceMap,
            macros: moduleSrc,
            nodeSourceMapSupport: options.nodeSourceMapSupport
          });
        });
      }
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
    var path = Module._resolveFilename(mod, mockModule);
    return grunt.file.read(path);
  }
};
