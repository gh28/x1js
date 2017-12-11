#!/usr/bin/env bash
root=$1
if test -z "$1"; then
    root=..
fi
mkdir -p $root/out
cat > $root/out/demo.html << EOF
<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    <title>demo</title>
</head>
    <script type="text/javascript">
`uglifyjs --compress --mangle -- $root/src/_G.js $root/src/P.js`
    </script>
<body>
    <script>
P.config({ path: { "jQuery": "https://code.jquery.com/jquery-3.2.1.min.js" } }).ask("init").answer(function() {
    var div = document.createElement("div");
    div.textContent = "hello world";
    document.body.appendChild(div);
});
P.ask().answer("init");
    </script>
</body>
</html>
EOF
