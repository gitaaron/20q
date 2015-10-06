module.exports = function (grunt) {
  var config = {
    jshint: {
      options: {
        ignores: ['node_modules/**', 'public/vendor/**', '**/*.min.js'],
        jshintrc: '.jshintrc'
      },
      gruntfile: 'Gruntfile.js',
      server: ['routes/**/*.js', 'app.js', 'config.js'],
      client: 'public/js/**/*.js'
    },
    concat: {
      css: {
        // add your css files over here to concatenate all css files
        // let's save our site users some bandwith
        files: {
          'public/css/app.styles.min.css': ['public/vendor/bootstrap/dist/css/bootstrap.min.css', 'public/css/styles.min.css']
        }
      }
    },
    uglify: {
      options: {
        mangle: {
          except: ['jQuery']
        }
      },
      dist: {
        files: {
          // add your js files over here to minify them into one javascript source file
          'public/js/app.min.js': ['public/vendor/jquery/dist/jquery.min.js', 'public/vendor/bootstrap/dist/js/bootstrap.min.js', 'public/js/main.js']
        }
      }
    },
    less: {
      src: {
        files: [{
          expand: true,
          cwd: 'public/less',
          src: '**/*.less',
          dest: 'public/css',
          ext: '.css'
        }]
      }
    },
    cssmin: {
      src: {
        files: [{
          expand: true,
          cwd: 'public/css',
          src: '**/*.css',
          dest: 'public/css',
          ext: '.min.css'
        }]
      }
    },
    'node-inspector': {
      options: {
        'save-live-edit': true
      }
    },
    watch: {
      all: {
        files: ['public/**/*', 'views/**', '!**/node_modules/**', '!public/vendor/**/*', '!**/*.min.*'],
        options: {
          livereload: 35729
        }
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: 'jshint:gruntfile'
      },
      scripts: {
        files: ['public/js/**/*.js', '!**/*.min.*']
        tasks: ['jshint:client', 'uglify:dist']
      },
      server: {
        files: '<%= jshint.server %>',
        tasks: 'jshint:server'
      },
      less: {
        files: ['public/less/**/*.less'],
        tasks: ['less', 'cssmin', 'concat:css']
      }
    },
    concurrent: {
      tasks: ['node-inspector', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }
  };

  grunt.initConfig(config);

  // Load the tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['jshint', 'uglify:dist', 'less', 'cssmin', 'concat:css', 'concurrent']);
};
