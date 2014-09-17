# grunt-swigtemplates

Use `grunt-swigtemplates` to create grunt tasks for processing your [swig](http://paularmstrong.github.io/swig/) templates. It'll be most useful when using swig as the templating engine for static sites, but should be general enough to be useful in other scenarios as well. The plugin includes methods for defining template variables with JSON files on the filesystem, or by defining them in the Grunt config. It also includes a simple mechanism for building localized versions of your static site using whatever internationalization tools you prefer.


## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-swigtemplates --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-swigtemplates');
```

## Features
* Easy static sites using swig's Django/Jinja2-like syntax
* Multiple, flexible ways of setting template syntax
* Simple localization using whatever i18n tools you prefer
* Use Grunt to define custom template filters and locals
* Gracefully handle i18n functions (and soon, locals) that return promises

## The "swigtemplates" task

### Overview
Configure Grunt to use swigtemplates to generate static HTML:

```js
swigtemplates: {
  options: {
    defaultContext: {
      pageTitle: 'My Title'
    },
    templatesDir: 'src/swig'
  },
  production: {
    dest: 'build/production/',
    src: ['src/swig/**/*.swig']
  },
  staging: {
    context: {
      pageTitle: 'My Title (staging)'
    },
    dest: 'build/staging/',
    src: ['src/swig/**/*.swig']
  }
}
```

Unsurprisingly, `grunt-swigtemplates` will create files in your `dest` folder for each of the templates you've created in `src`. Your template filenames should take the form, `<filename>.<extension>.swig`, which will result in destination files, `<filename>.<extension>`. Template context variables can be set in a number of ways, and will be evaluated in this order of precedence:

1. Define a file called `globals.json` in your `templatesDir`, and any values you set there will be added into context
2. For a given file, `myfile.html.swig`, you can define file-specific context values by creating a companion file,`myfile.html.json` in the same folder. Values defined here will override anything set in `globals.json`
3. Context values set in `options.defaultContext` will override anything in filesystem JSON files
4. Target-specific context values (like pageTitle in the staging target above) will replace anything else


### Options

#### options.defaultContext

 * Type: `Object`
 * Default value: `{}`

A default context object passed into swig templates during processing. These values will override any that were
set on the file system with `global.json` or `myfile.html.json`, and can be overridden by the `context` property
on individual `swigtemplates` targets.

#### options.templatesDir

* Type: `String`
* Default value: `'.'`

Use `templatesDir` to define where `grunt-swigtemplates` will look for globals.json.

#### options.locals

* Type: `Object`
* Default value: `{}`

Set local values that will be available in all swig templates. This can be especially useful if you want to add a
callable function into the context without having to build a custom tag.

```js
swigtemplates {
  options: {
    locals: {
      reverse: function(msg) {
        return msg.split('').reverse().join('');
      }
    }
  }
}
```

**Template**
```html
<p>{{ reverse('Racecar!') }}</p>
```

**Result**
```html
<p>!racecaR</p>
```


#### options.filters

* Type: `Object`
* Default value: `{}`

Adds custom swig filters. See the [swig documentation](http://paularmstrong.github.io/swig/docs/extending/#filters)
on extending swig with custom filters for more information.

```js
swigtemplates {
  options: {
    defaultContext: {
      myStr: 'Racecar!'
    },
    filters: {
      reverse: function(msg) {
        return msg.split('').reverse().join('');
      }
    }
  }
}
```

**Template**
```html
<p>{{ myStr|reverse }}</p>
```

**Result**
```html
<p>!racecaR</p>
```


#### options.autoEscape

* Type: `Boolean`
* Default value: `true`

By default, swig escapes all variable data for safe HTML. Change `autoEscape` to `false` to prevent this behavior. Note: that's actually not a super-awesome idea unless you have really compelling reason for doing so. In almost every case, you'll be better off explicitly turning off escaping only for specific variables. For variables you trust, you can turn off escaping with swig's built-in [safe filter](http://paularmstrong.github.io/swig/docs/filters/#safe).

#### options.tagControls

* Type: `Array`
* Default value: `['{%', '%}']`

Change the opening and closing markers for template tags.

#### options.varControls
* Type: `Array`
* Default value: `['{{', '}}']`

Change the opening and closing markers for variables in templates.


#### options.cmtControls
* Type: `Array`
* Default value: `['{#', '#}']`

Change the opening and closing markers for comments.


#### options.locales
* Type: `Array`
* Default value: `[]`

Use this to define a list of locales (or language codes, or whatever suits your needs). `grunt-swigtemplates` will create a new folder for each of these items and publish a localized version of your site in each folder.

So. Given this configuration:
```js
swigtemplates: {
  options: {
    locales: ['en-US', 'es-US'],
    translationFunction: myTranslator,
    templatesDir: 'src/swig'
  },
  mySite: {
    dest: 'build/',
    src: ['src/swig/**/*.swig']
  }
}
```

...you'll get something like this:
```
Gruntfile.js
build/
  en-US/
    about.html
    index.html
  es-US/
    about.html
    index.html
src/
  global.json
  about.html.json
  about.html.swig
  index.html.json
  index.html.swig
```


#### options.defaultLocale
* Type: `String`
* Default value: `undefined`

When doing localization, use `defaultLocale` to set one of the things you've defined in `options.locales` as the default. By doing so, your default locale won't get buried behind a locale-specific folder.

Given this configuration:
```js
swigtemplates: {
  options: {
    locales: ['en-US', 'es-US'],
    defaultLocale: 'en-US',
    translationFunction: myTranslator,
    templatesDir: 'src/swig'
  },
  mySite: {
    dest: 'build/',
    src: ['src/swig/**/*.swig']
  }
}
```

...you'll get something like this:
```
Gruntfile.js
build/
  about.html
  index.html
  es-US/
    about.html
    index.html
src/
  global.json
  about.html.json
  about.html.swig
  index.html.json
  index.html.swig
```


#### options.translateFunction
* Type: `Function`
* Default value: `function(locale) { return function(msg) { return msg; } }`

A function that accepts a locale (one of the things defined in `options.locales`), and returns either:

* A function that does your translating for you - the function called from your templates with `options.translateFunctionName`
* A promise that returns a function to be used for `options.translateFunctionName`


#### options.translateFunctionName
* Type: `String`
* Default value: `'__'`



### Usage Examples

#### Default Options

```js
grunt.initConfig({
  swigtemplates: {
  }
});

```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


## Release History

 * 2013-12-08   v0.0.1   Initial version
 * 2014-08-25   v0.0.2   Updated context precedence
 * 2014-08-25   v0.0.3   Filters and locals
 * 2014-08-27   v0.0.4   Simple internationalization
 * 2014-08-27   v0.0.5   Minor change

