<script>
  (function () {
    var context = requirejs.s.contexts._;
    var paths = <?= json_encode($asset->getRevMap(), JSON_UNESCAPED_SLASHES) ?>;
    var prefix = '<?= $e($asset->getRevPrefix()) ?>';

    var urlArgs = context.config.urlArgs;
    context.config.urlArgs = '';

    var nameToUrl = context.nameToUrl;
    context.nameToUrl = function (moduleName, ext, skipExt) {
      var url = nameToUrl(moduleName, ext, skipExt);
      // Ignore internal module that starts with "_@r"
      if (moduleName.charAt(0) == '_') {
        return url;
      }

      // Remove leading slash for path map
      var trim = false;
      if (url.charAt(0) == '/') {
        url = url.substr(1);
        trim = true;
      }
      if (typeof paths[url] != 'undefined') {
        // Insert hash to url before extension
        var index = url.lastIndexOf('.');
        url = prefix + url.substr(0, index) + '-' + paths[url] + url.substr(index);
        trim = false;
      }
      if (trim) {
        url = '/' + url;
      }
      return urlArgs ? url + ((url.indexOf('?') === -1 ? '?' : '&') + urlArgs) : url;
    };
  }());
</script>
