(function() {
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
            .split("%>").join("print('")
            .split("\r").join("\\'");
        var fn = new Function("data",
            "var buffer = []; " +
            "var print = function() { buffer.push.apply(buffer, arguments); }; " +
            "with(data) { print('" + s + "'); } " +
            "return buffer.join('');");
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
            .replace(/&lt;%/g, "<%");
    }

    function instantiate(template, data) {
        return compile(template).render(data);
    }

    function instantiateByDomId(domId, data) {
        if (typeof cache[domId] === "undefined") {
            template = getTemplate(domId);
            cache[domId] = compile(template);
        }
        return cache[domId].render(data);
    }

    this.templateEngine = {
        instantiate: instantiate,
        instantiateByDomId: instantiateByDomId
    };
})();
