#!/usr/bin/env bash

if [[ "$BASH_SOURCE" == /* ]]; then
    TOP=$(realpath $(dirname $BASH_SOURCE)/..)
else
    TOP=$(realpath $(pwd)/$(dirname $BASH_SOURCE)/..)
fi

mkdir -p $TOP/out
cat > $TOP/out/demo.html << EOF
<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    <title>demo</title>
    <script type="text/javascript">
`cat \
    $TOP/out/embedded.min.js \
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
