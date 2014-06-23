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
  var result = sweet.compile(code, opts);
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

  grunt.registerMultiTask('sweetjs', 'Sweeten your JavaScript', function() {
    var task = this;
    var options = this.options({
      modules: []
    });

    var moduleContexts = options.modules.map(function(m) {
      return moduleCache[m] || (moduleCache[m] = expandModuleFromCwd(m));
    });

    this.files.forEach(function(f) {
      var src = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      if(f.dest && f.src.length > 1) {
        var src = src.map(function(filepath) {
          return grunt.file.read(filepath);
        }).join('\n');

        sweetCompile(grunt, src, f.dest, {
          filename: '<concatenated>',
          sourceMap: options.sourceMap,
          modules: moduleContexts,
          nodeSourceMapSupport: options.nodeSourceMapSupport,
          readableNames: options.readableNames
        });
      }
      else {
        src.forEach(function(filepath) {
          var outpath;
          var ext = path.extname(filepath);
          var base = path.join(path.dirname(filepath),
                               path.basename(filepath, ext));

          if(f.dest) {
            var lastchar = f.dest.substr(f.dest.length-1);
            if (lastchar === "/" || lastchar === "\\") {
              outpath = f.dest + "/" + path.basename(filepath,ext) + '.js';
            } else {
              outpath = f.dest;
            }
          }
          else if(ext == '.js') {
            outpath = base + '.built.js';
          }
          else {
            outpath = base + '.js';
          }

          grunt.log.writeln('compiling ' + filepath);
          sweetCompile(grunt, grunt.file.read(filepath), outpath, {
            filename: filepath,
            sourceMap: options.sourceMap,
            modules: moduleContexts,
            nodeSourceMapSupport: options.nodeSourceMapSupport,
            readableNames: options.readableNames
          });
        });
      }
    });
  });

  function expandModuleFromCwd(mod) {
    return sweet.loadNodeModule(process.cwd(), mod);
  }
};
