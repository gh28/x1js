(function() {
    // should keep cache transparent
    var cache = {};

    /**
     * compile jsTemplate to a render function
     * jsTemplate is a string mainly html with javascript code in <% %> and <%= %> block
     */
    function compile(jsTemplate) {
        jsTemplate = jsTemplate
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'");
        var fn = new Function("data", "  \
            var p = []; \
            var print = function() {  \
                p.push.apply(p, arguments); \
            };  \
            with(data) { \
                p.push('" + jsTemplate + "'); \
            } \
            return p.join('');");
        return {
            render: fn
        };
    }

    function compileByDomId(domId) {
        if (/[^-0-9A-Z_a-z]/.test(domId)) {
            throw new Error("invalid tag id");
        }

        var domElement = document.getElementById(domId);
        if (!domElement) {
            throw new Error("cannot find dom id: " + domId);
        }

        return compile(domElement.innerHTML);
    }

    function instantiate(jsTemplate, data) {
        return compile(jsTemplate).render(data);
    }

    // FIXME innerHTML sends '&lt;%' for '<%' and so as '%>'
    function instantiateById(domId, data) {
        if (/[^-0-9A-Z_a-z]/.test(domId)) {
            throw new Error("invalid dom id");
        }

        // lookup cache first
        if (typeof cache[domId] === "undefined") {
            cache[domId] = compileByDomId(domId);
        }
        return cache[domId].render(data);
    }

    this.jsTemplateEngine = {
        instantiate: instantiate,
        instantiateById: instantiateById
    };
})();
