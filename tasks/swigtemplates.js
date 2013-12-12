/*
 * grunt-swigtemplates
 * https://github.com/blinkylights23/grunt-swigtemplates
 *
 * Copyright (c) 2013 Paul Smith
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var fs = require('fs'),
      swig = require('swig'),
      path = require('path');

  grunt.registerMultiTask('swigtemplates', 'Grunt plugin for working with swig templates.', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      autoEscape: true,
      varControls: ['{{', '}}'],
      tagControls: ['{%', '%}'],
      cmtControls: ['{#', '#}'],
      filters: {},
      tags: {},
      context: {},
      templatesDir: '.'
    });


    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      var src = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {

        var outfileName = path.basename(filepath, '.swig'),
            dirName = path.dirname(filepath),
            outfilePath = path.normalize(path.relative(options.templatesDir, dirName)),
            outfile = path.join(f.dest, outfilePath, outfileName);

        // Get context
        var context = f.context,
            globalContext,
            templateContext;
        try {
          globalContext = grunt.file.readJSON(path.join(options.templatesDir, "global.json"));
        } catch(err) {
          grunt.log.warn('No global.json: ', err);
          globalContext = {};
        }
        try {
          templateContext = grunt.file.readJSON(path.join(dirName, outfileName) + ".json");
        } catch(err) {
          templateContext = {};
        }
        grunt.util._.extend(context, globalContext, templateContext);

        // Write the destination file.
        swig.setDefaults({
          autoescape: options.autoEscape,
          varControls: options.varControls,
          tagControls: options.tagControls,
          cmtControls: options.cmtControls
        });
        grunt.file.write(outfile, swig.renderFile(filepath, context));

        // Print a success message.
        grunt.log.writeln('File "' + outfile + '" created.');
      });

    });

  });

};
