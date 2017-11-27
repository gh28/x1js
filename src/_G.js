// the top object _G
(function() {
    if (typeof _G === "object" && _G !== null && _G === _G._G) {
        // already
        return;
    }

    var G = null;
    if (typeof window !== "undefined" && typeof navigator !== "undefined" && window.document) {
        G = window;
        G.vm = "browser";
    } else if (typeof process !== "undefined" && process.versions && process.versions.node) {
        G = global;
        G.vm = "node"
    }

    if (G) {
        Object.defineProperties(G, {
            // prefix underscore suggests it is a preset/internal variable
            _G: {
                value: G,
                configurable: false,
                enumerable: false,
                writable: false
            }
        });
    }
})();
