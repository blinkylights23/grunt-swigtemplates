# grunt-swigtemplates

This plugin is for creating [Grunt](http://gruntjs.com/) tasks that compile Django/Jinja2 -like templates
with Paul Armstrong's JavaScript template engine, [swig](http://paularmstrong.github.io/swig/).

`grunt-swigtemplates` is brand-spankin' new, and while basic functionality is currently working, it's definitely
alpha.

## Getting Started
This plugin requires Grunt `~0.4.2`

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
      templatesDir: 'src'
    },
    compile: {
      options: {},
      dest: 'www/',
      src: ['src/**/*.swig']
    }
  }
});
```




### Options
Coming soon


### Usage Examples
Coming soon


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).



## Release History

 * 2013-12-8   v0.0.1   Initial version