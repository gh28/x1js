this.jsEngine = (function() {
    // should keep cache transparent
    var cache = {};

    /**
     * compile template to a render function
     * template is roughly html with javascript embeded as <% %> or <%= %>
     */
    function compile(template) {
        var s = template
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("puts('")
            .split("\r").join("\\'");
        var fn = new Function("data", "\
            var buffer = []; \
            function puts() {\
                var va = [];\
                for (var i = 0; i < arguments.length; ++i) {\
                    var v = arguments[i];\
                    if (typeof v === 'string') {\
                        va.push(v);\
                    } else if (typeof v === 'object' && v instanceof Array) {\
                        va.push(v.join('<br/>'));\
                    }\
                }\
                buffer.push(va);\
            }\
            puts('" + s + "');\
            return buffer.join(\"\");\
        ");
        return {
            render: fn
        };
    }

    function getTemplate(domId) {
        if (/[^-0-9A-Z_a-z]/.test(domId)) {
            throw new Error("invalid tag id");
        }

        var domElement = document.getElementById(domId);
        if (!domElement) {
            throw new Error("cannot find dom id: " + domId);
        }

        return domElement.innerHTML
            .replace(/%&gt;/g, "%>")
            .replace(/&lt;%/g, "<%")
            .replace(/(<%.*?)(&lt;)(.*?%>)/g, "$1<$3")
            .replace(/(<%.*?)(&gt;)(.*?%>)/g, "$1>$3")
            .replace(/(<%.*?)(&amp;){2}(.*?%>)/g, "$1&&$3");
    }

    function instantiate(template, data) {
        return compile(template).render(data);
    }

    function instantiateByDomId(domId, data, dataName) {
        if (typeof cache[domId] === "undefined") {
            template = getTemplate(domId);
            cache[domId] = compile(template);
        }
        return cache[domId].render(data, "ff");
    }

    return {
        instantiate: instantiate,
        instantiateByDomId: instantiateByDomId
    };
})();
