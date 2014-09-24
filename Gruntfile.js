module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-semantic-release');

  grunt.initConfig({
    release: {
      email: 'gregor@martynus.net',
      name: 'Gregor Martynus'
    }
  })
};
