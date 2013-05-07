module.exports = function(grunt) {
  var banner = '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n';

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		uglify : {
			options : {
        banner : banner
      },
      build : {
        dest : 'public/js/<%= pkg.name %>.min.js',
        src : [
          'public/js/support/zepto.js',
          'public/js/support/handlebars*.js',
          'public/js/jstorage.min.js',
          'public/js/SM.js',
          'public/js/SM.search.js',
          'public/js/SM.category.js',
        ]
      }
		},
    cssmin : {
      options : {
        banner : banner
      },
      compress : {
        dest : 'public/css/sephora.css',
        src : [
          'public/css/tom_base.css',
          'public/css/tom.css',
          'public/css/css3.css',
          'public/css/search.css'
        ]
      }
    }
	});

  // load dependent tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // default task when grunt is run
  grunt.registerTask('default', ['uglify', 'cssmin']);
}