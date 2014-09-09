/*
 * grunt-swigtemplates
 * https://github.com/blinkylights23/grunt-swigtemplates
 *
 * Copyright (c) 2014 Paul Smith
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var fs = require('fs'),
      util = require('util'),
      swig = require('swig'),
      _ = require('lodash'),
      path = require('path');

  var Q = require('q');

  var inspect = function(obj) {
    var inspectOpts = {
      showHidden: true,
      depth: null,
      colors: true
    };
    return util.inspect(obj, inspectOpts);
  };


  grunt.registerMultiTask('swigtemplates', 'Grunt plugin for working with swig templates.', function(target) {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      autoEscape: true,
      varControls: ['{{', '}}'],
      tagControls: ['{%', '%}'],
      cmtControls: ['{#', '#}'],
      locals: {},
      locales: [],
      defaultLocale: undefined,
      translateFunction: function(locale) { return function(msg) { return msg; } },
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

    // Hold on to your butts
    if (!useI18n) {
      handleFiles(this.files);
    } else {
      handleI18nFiles(this.files);
    }

    // Handle non-i18n files
    function handleFiles(files) {
      files.forEach(function(f) {
        f.src.filter(srcExists).map(function(filepath) {
          var pathInfo = getPathInfo(filepath, f.dest),
              context = getContext(f.context, pathInfo);
          renderFile(pathInfo.outfile, filepath, context);
        });
      });
    };

    // Handle i18n files
    function handleI18nFiles(files) {
      options.locales.forEach(function(locale) {
        grunt.registerTask('swigtemplatesSubtask-' + locale, function() {
          var done = this.async();
          var translatorFactory = options.translateFunction(locale);
          Q.when(translatorFactory, function(translator) { doTranslations(files, locale, translator) }).done(done);
        });
        grunt.task.run('swigtemplatesSubtask-' + locale);
      });
    }

    // Do translations
    function doTranslations(files, locale, translator) {
      files.forEach(function(f) {
        f.src.filter(srcExists).map(function(filepath) {
          var pathInfo = getPathInfo(filepath, f.dest),
              context = getContext(f.context, pathInfo);
          if (locale !== options.defaultLocale) {
            pathInfo.outfile = path.join(f.dest, locale, pathInfo.outfilePath, pathInfo.outfileName);
          }
          context.locale = locale;
          options.locals[options.translateFunctionName] = function() {
            var args = Array.prototype.slice.call(arguments);
            return translator(args);
          };
          swig.setDefaults({ locals: options.locals });
          renderFile(pathInfo.outfile, filepath, context);
        });
      });
    }

    // Render file
    function renderFile(outfile, filepath, context) {
      grunt.file.write(outfile, swig.renderFile(filepath, context));
      grunt.log.ok('File "' + outfile + '" created.');
    }

    // Get path info for src/dest
    function getPathInfo(filepath, dest) {
      var outfileName = path.basename(filepath, '.swig'),
        dirName = path.dirname(filepath),
        outfilePath = path.normalize(path.relative(options.templatesDir, dirName)),
        outfile = path.join(dest, outfilePath, outfileName);
      return { outfileName: outfileName, dirName: dirName, outfilePath: outfilePath, outfile: outfile };
    }

    // Get swig context
    function getContext(context, pathInfo) {
      var globalContext,
          templateContext;

      try {
        globalContext = grunt.file.readJSON(path.join(options.templatesDir, "global.json"));
      } catch(err) {
        globalContext = {};
      }
      try {
        templateContext = grunt.file.readJSON(path.join(pathInfo.dirName, pathInfo.outfileName) + ".json");
      } catch(err) {
        templateContext = {};
      }
      return _.extend({}, globalContext, templateContext, options.defaultContext, context);
    }

    // Src file exists
    function srcExists(filepath) {
      if (!grunt.file.exists(filepath)) {
        grunt.log.warn('Source file "' + filepath + '" not found.');
        return false;
      } else {
        return true;
      }
    }

  });

};
