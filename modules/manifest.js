'use strict';

var through = require('through2');
var objectAssign = require('object-assign');
var file = require('vinyl-file');
var gutil = require('gulp-util');
var path = require('path');

function relPath(base, filePath) {
  if (filePath.indexOf(base) !== 0) {
    return filePath.replace(/\\/g, '/');
  }

  var newPath = filePath.substr(base.length).replace(/\\/g, '/');

  if (newPath[0] === '/') {
    return newPath.substr(1);
  }

  return newPath;
}

function getManifestFile(opts, cb) {
  file.read(opts.path, opts, function (err, manifest) {
    if (err) {
      // not found
      if (err.code === 'ENOENT') {
        cb(null, new gutil.File(opts));
      } else {
        cb(err);
      }

      return;
    }

    cb(null, manifest);
  });
}

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

var manifest = {};
var count = 0;

var plugin = function (pth, opts) {

  if (typeof pth === 'string') {
    pth = {path: pth};
  }

  opts = objectAssign({
    path: 'rev-manifest.json'
  }, opts, pth);

  var firstFile = null;

  count++;

  return through.obj(function (file, enc, cb) {
    // ignore all non-rev'd files
    if (!file.path || !file.revOrigPath) {
      cb();
      return;
    }

    firstFile = firstFile || file;

    // 对合并文件做特殊处理
    var origName = '';
    if (endsWith(firstFile.base, '/concat')) {
      origName = 'concat/' + path.basename(file.revOrigPath);
    } else {
      // cwd可能改变
      origName = relPath(firstFile.cwd, file.revOrigPath);
    }

    manifest[origName] = file.revHash;

    cb();
  }, function (cb) {
    count--;

    if (Object.keys(manifest).length === 0) {
      cb();
      return;
    }

    if (count == 0) {
      getManifestFile(opts, function (err, manifestFile) {
        if (err) {
          cb(err);
          return;
        }

        var oldManifest = {};

        try {
          oldManifest = JSON.parse(manifestFile.contents.toString());
        } catch (err) {}

        manifest = objectAssign(oldManifest, manifest);

        manifestFile.contents = new Buffer(JSON.stringify(manifest, null, '  '));
        this.push(manifestFile);
        cb();
      }.bind(this));
    } else {
      cb();
    }
  });
};

module.exports = plugin;
