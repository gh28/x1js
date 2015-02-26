(function() {
  var cache = {};

  /**
   * jsTemplate is a string mainly html with javascript code in <% %> and <%= %> block
   */
  function generateRenderer(jsTemplate) {
    jsTemplate = jsTemplate
      .replace(/[\r\t\n]/g, " ")
      .split("<%").join("\t")
      .replace(/((^|%>)[^\t]*)'/g, "$1\r")
      .replace(/\t=(.*?)%>/g, "',$1,'")
      .split("\t").join("');")
      .split("%>").join("p.push('")
      .split("\r").join("\\'");
    return new Function("data", "  \
        var p = []; \
        var print = function() {  \
          p.push.apply(p, arguments); \
        };  \
        with(data) { \
          p.push('" + jsTemplate + "'); \
        } \
        return p.join('');");
  };

  this.instantiate = function(s, data) {
    if (/\W/.test(s)) {
      // it contains [^0-9A-Z_a-z], not to cache
      return generateRenderer(s)(data);
    }

    // it is an id for a tag
    var id = s;
    s = document.getElementById(id).innerHTML;
    cache[id] = cache[id] || generateRenderer(s);
    return cache[id](data);
  };
})();
