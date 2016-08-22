module.exports = function (grunt) {

    grunt.initConfig({
        wiredep: {
            task: {
                src: [
                    '**/*.html'
                ]
            }
        },
        tree: {
            default: {
                options: {},
                files: [
                    {
                        src: ['app/kits/'],
                        dest: 'app/elements.json'
                    }
                ]
            }
        },
        serve: {
            options: {
                serve: {
                    path: 'app'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-serve');
    grunt.loadNpmTasks('grunt-tree');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.registerTask('default', ['serve']);
    grunt.registerTask('elements', ['tree']);


};