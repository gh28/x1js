#!/usr/bin/env bash
top=$(realpath $(pwd)/$(dirname $0)/..)
mkdir -p $top/out
cat > $top/out/demo.html << EOF
<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    <title>demo</title>
    <script type="text/javascript">
`cat $top/src/lang/_G.js`
`cat $top/src/lang/x1.js`
`cat $top/src/lang/import.js`
`cat $top/src/lang/P.js`
    </script>
</head>
<body>
    <script>
P.addConfig("jQuery", {
    "uri": "https://code.jquery.com/jquery-3.2.1.min.js",
    "onLoaded": function() {
        P.ask().answer("jQuery", function() {
            return jQuery;
        });
    }
});
P.ask("init").answer(function() {
    var div = document.createElement("div");
    div.textContent = "hello world";
    document.body.appendChild(div);
});
P.ask("jQuery").answer("init");
    </script>
</body>
</html>
EOF
