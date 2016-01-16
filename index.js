'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;

module.exports = function(outfile, opt) {
    var joinedShaders = '';
    var shaders = {};

    if (!opt) {
        opt = {}
    }

    if (!opt.assignto) {
        opt.assignto = 'x';
    }

    if (opt.module) {
        opt.modulename = 'default';
    }

    if (!outfile) {
       outfile = 'shaders';
    }

    function makeJS(file, enc, cb) {
        var shadertxt = String(file.contents);
        shadertxt = shadertxt.replace(/\r?\n/g, ' ');
        shadertxt = shadertxt.replace(/\t/g, ' ');

        var filename = path.basename(file.path, '.glsl');
        //shadertxt = opt.namespace + "." + filename + " = '" + shadertxt + "';";

        var shadername;
        var shadertype;
        if (filename.indexOf('.vertex') !== -1) {
            shadername = filename.substr(0, filename.indexOf('.vertex'));
            shadertype = 'vertex';
        } else if (filename.indexOf('.fragment') !== -1) {
            shadername = filename.substr(0, filename.indexOf('.fragment'));
            shadertype = 'fragment';
        }

        if (!shaders[shadername]) {
            shaders[shadername] = {};
        }
        shaders[shadername][shadertype] = shadertxt;
        cb();
    };

    function endStream(cb) {
        var file = new gutil.File({
            base: path.join(__dirname, './'),
            cwd: __dirname,
            path: path.join(__dirname, './' + outfile + '.json')
        });

        file.contents = new Buffer(JSON.stringify(shaders, null, 2));
        this.push(file);

        var file = new gutil.File({
            base: path.join(__dirname, './'),
            cwd: __dirname,
            path: path.join(__dirname, './' + outfile + '.js')
        });

        if (opt.module) {
            file.contents = new Buffer('export ' + opt.modulename + ' ' + JSON.stringify(shaders, null, 2));
        } else {
            file.contents = new Buffer(opt.assignto + ' = ' + JSON.stringify(shaders, null, 2) + ';');
        }
        this.push(file);
        cb();
    }


    return through.obj(makeJS, endStream);
};