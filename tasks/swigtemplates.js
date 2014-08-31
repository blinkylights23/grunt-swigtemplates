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
      locales: [],
      defaultLocale: undefined,
      translateFunction: function(locale, msg) { return msg; },
      translateFunctionName: '__', 
      filters: {},
      defaultContext: {},
      templatesDir: '.'
    });
    var data = this.data,
        useI18n = false;

    // Localization settings
    if (options.locales.length > 0) { useI18n = true; }
    if (useI18n && options.defaultLocale && options.locales.indexOf(options.defaultLocale) === -1) {
      grunt.log.error('Default locale ' + options.defaultLocale + ' not in configured locales: ' + inspect(options.locales));
    }
    if (!useI18n) {
      swig.setDefaults({ locals: options.locals });
    }

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

        // Write the destination file(s).
        if (useI18n) {
          context.locales = options.locales;
          options.locales.forEach(function(l) {
            var localizedOutFile = outfile;
            if (l !== options.defaultLocale) {
              localizedOutFile = path.join(f.dest, l, outfilePath, outfileName);
            }
            context.locale = l;
            options.locals[options.translateFunctionName] = function() {
              var args = Array.prototype.slice.call(arguments);
              return options.translateFunction(l, args);
            };
            swig.setDefaults({ locals: options.locals });
            grunt.file.write(localizedOutFile, swig.renderFile(filepath, context));
            grunt.log.ok('File "' + localizedOutFile + '" created.');
          });
        } else {
          grunt.file.write(outfile, swig.renderFile(filepath, context));
          grunt.log.ok('File "' + outfile + '" created.');
        }

      });

    });

  });

};
