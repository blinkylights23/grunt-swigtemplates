/*
 * grunt-swigtemplates
 * https://github.com/blinkylights23/grunt-swigtemplates
 *
 * Copyright (c) 2013 Paul Smith
 * Licensed under the MIT license.
 */

'use strict';

var vsprintf = require('sprintf').vsprintf,
  fs = require('fs'),
  _ = require('lodash'),
  path = require('path');


var I18n = function(options) {

  var defaultOptions = {
    directory: './locales',
    extension: 'json',
    locale: undefined,
    locales: []
  };
  var options = _.defaults(options, defaultOptions);

  for (var prop in options) {
    this[prop] = options[prop];
  }
  this.localeData = {};

  if (this.locales.length < 1) {
    throw('We need to define at least one locale');
  }
  this.setLocale(this.locales);

};

I18n.prototype.setLocale = function(locale) {
  if (!locale) {
    locale = this.locales[0];
  }
  if (!this.locales[locale]) {
    console.warn('Locale ' + locale + ' is not one of our defined locales');
    locale = this.locales[0];
  }
  this.locale = locale;
  if (!this.localeData[this.locale]) {
    this.readFile(this.locale);
  }
}

I18n.prototype.locateFile = function(locale) {
  return path.normalize(this.directory + '/' + locale + this.extension);
},

I18n.prototype.readFile = function(locale) {
  var file = this.locateFile(locale);
  try {
    var localeFileData = fs.readFileSync(file);
    try {
      this.localeData[locale] = JSON.parse(localeFileData);
    } catch (e) {
      console.error('Unable to parse data from file: ' + file, e);
    }
  } catch (e) {
    console.error('Unable to open locale file: ' + file, e);
  }
};

I18n.prototype.__ = function() {
  var msg = this.translate(this.locale, arguments[0]);
  if (arguments.length > 1) {
    msg = vsprintf(msg, Array.prototype.slice.call(arguments, 1));
  }
  return msg;
};

I18n.prototype.__n = function(singular, plural, count) {
  var msg = this.translate(this.locale, singular, plural);
  msg = vsprintf(parseInt(count, 10) > 1 ? msg.other : msg.one, [count]);
  if (arguments.length > 3) {
    msg = vsprintf(msg, Array.prototype.slice.call(arguments, 3));
  }
  return msg;
};

I18n.prototype.translate = function(locale, singular, plural) {
  if (!this.localeData[locale][singular]) {
    this.locales[locale][singular] = plural ?
      { one: singular, other: plural } :
      singular;
  }
  return this.locales[locale][singular];
};



module.exports = I18n;






