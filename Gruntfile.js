module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-semantic-release');

  grunt.initConfig({
    release: {
      email: 'stephan@boennemann.me',
      name: 'Stephan Bönnemann'
    }
  })
};
