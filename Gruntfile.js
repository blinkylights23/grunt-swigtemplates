/*
 * grunt-swigtemplates
 * https://github.com/blinkylights23/grunt-swigtemplates
 *
 * Copyright (c) 2013 Paul Smith
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    swigtemplates: {
      options: {
        templatesDir: 'test/fixtures',
        defaultContext: {
          defaultContext: 'defaultContext',
          overrideContext: 'defaultContext'
        },
        filters: {
          racecar: function(input) {
            return 'racecar';
          }
        },
        locals: {
          testMe: function() {
            return 'Hello from testMe!';
          }
        },
        locales: ['en-US', 'fr-FR'],
        defaultLocale: 'en-US'
      },
      test: {
        options: {},
        context: {
          overrideContext: 'target.context'
        },
        dest: 'tmp/',
        src: ['test/fixtures/**/*.swig']
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'swigtemplates', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
