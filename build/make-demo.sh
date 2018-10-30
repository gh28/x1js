#!/usr/bin/env bash
top=$(realpath $(pwd)/$(dirname $0)/..)
mkdir -p $top/out
cat > $top/out/demo.html << EOF
<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    <title>demo</title>
    <script type="text/javascript">
`#uglifyjs -c properties,dead_code,collapse_vars -m -- \
    $top/src/{_G,P}.js \
`
`cat \
    $top/src/_G.js \
    $top/src/P.js \
    $top/src/x1.js \
    $top/src/primitive/Cmap.js \
`
    </script>
</head>
<body>
    <script>
P.addConfig("jQuery", "https://code.jquery.com/jquery-3.2.1.min.js", function() {
    P.ask().answer("jQuery", function() {
        return jQuery;
    });
});
P.ask("init").answer(null, function() {
    var div = document.createElement("div");
    div.textContent = "hello world";
    document.body.appendChild(div);
});
P.ask("jQuery").answer("init", null);
    </script>
</body>
</html>
EOF
