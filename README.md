GL2JS
=====

var gulp = require('gulp');
var gl2js = require('gulp-gl2js');

gulp.task('default', function(cb) {
    gulp.src('./src/shaders/*.glsl')
        .pipe(gl2js('shaders', { assignto: 'var shaders'} ))
        .pipe(gulp.dest('build'));
});

Usage
=======

Very limited: will run through your GLSL files. Fragment shaders must be named <myshader>.fragment.glsl, and Vertex shaders must be named <myshader>.vertex.glsl.
Will outuput a JSON file for no apparent reason other than I could, but will also output a JS file with an object comprised of shader properties (the name of your shader) each
with properties .vertex and .shader, each with the text of your GLSL file.

You may pass in an "assignto" to set the var that you'd like to assign the shaders to.

For example, "var shaders" as described above will create a JS file like so:

var shaders = { ... };

You might like to namespace stuff, as I do for my projects. So my "assignto" is a JS namespace:

mynamespace.shaders = { ... }