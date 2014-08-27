# grunt-swigtemplates

Use `grunt-swigtemplates` to create grunt tasks for processing your [swig](http://paularmstrong.github.io/swig/)
templates. It'll be most useful when using swig as the templating engine for static sites, but should be general enough
to be useful in other scenarios as well. The plugin includes methods for defining template variables with JSON files
on the filesystem, or by defining them in the Grunt config. It also includes a simple mechanism for building localized
versions of your static site using whatever internationalization tools you prefer.


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

## The "swigtemplates" task

### Overview
In your project's Gruntfile, add a section named `swigtemplates` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  swigtemplates: {
    options: {
      defaultContext: {
        pageTitle: 'My Title'
      },
      templatesDir: 'src/swig'
    },
    production: {
      dest: 'build/',
      src: ['src/swig/**/*.swig']
    },
    staging: {
      context: {
        pageTitle: 'My Title (staging)'
      },
      dest: 'build/',
      src: ['src/swig/**/*.swig']
    }
  }
});
```

#### Context precedence
1. Define a file called `globals.json` in your `templatesDir`, and any values you set there will be added into context
2. For a given file, `myfile.html.swig`, you can define file-specific context values by creating a companion file,`myfile.html.json` in the same folder with values that will override anything set in `globals.json`
3. Context values set in `options.defaultContext` will override anything in filesystem JSON files
4. Target-specific context values will replace anything else

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

Use `templatesDir` to define where `grunt-swigtemplates` will look for globals.json and file-specific JSON context.

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

```html
<p>{{ reverse('Racecar!') }}</p>
```

```html
<p>!racecaR</p>
```


#### options.filters

* Type: `Object`
* Default value: `{}`

#### options.autoEscape

* Type: `Boolean`
* Default value: `true`

#### options.tagControls

* Type: `Array`
* Default value: `['{%', '%}']`

#### options.varControls
* Type: `Array`
* Default value: `['{{', '}}']`

#### options.cmtControls
* Type: `Array`
* Default value: `['{#', '#}']`

#### options.locales
* Type: `Array`
* Default value: `[]`

#### options.defaultLocale
* Type: `String`
* Default value: `undefined`

#### options.translateFunction
* Type: `Function`
* Default value: `function(locale, msg) { return msg; }`

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

