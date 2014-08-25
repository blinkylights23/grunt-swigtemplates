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
      util = require('util'),
      swig = require('swig'),
      _ = require('lodash'),
      path = require('path');


  var inspect = function(obj) {
    var inspectOpts = {
      showHidden: true,
      depth: null,
      colors: true
    };
    return util.inspect(obj, inspectOpts);
  };


  grunt.registerMultiTask('swigtemplates', 'Grunt plugin for working with swig templates.', function(target) {


    // Context precedence order
    // 1. global.json
    // 2. myfile.ext.json
    // 3. options: { defaultContext: {} }
    // 4. target: { context: {} }


    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      autoEscape: true,
      varControls: ['{{', '}}'],
      tagControls: ['{%', '%}'],
      cmtControls: ['{#', '#}'],
      locals: {},
      filters: {},
      defaultContext: {},
      templatesDir: '.'
    });

    var data = this.data;

    // Configure swig
    swig.setDefaults({
      locals: options.locals,
      autoescape: options.autoEscape,
      varControls: options.varControls,
      tagControls: options.tagControls,
      cmtControls: options.cmtControls
    });

    // Swig custom filters
    Object.keys(options.filters).forEach(function(key) {
      swig.setFilter(key, options.filters[key]);
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
        var globalContext,
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
        var context = _.extend({}, globalContext, templateContext, options.defaultContext, f.context);

        // Write the destination file.
        grunt.file.write(outfile, swig.renderFile(filepath, context));

        // Print a success message.
        grunt.log.ok('File "' + outfile + '" created.');
      });

    });

  });

};
