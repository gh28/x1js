#!/usr/bin/env bash
mkdir -p out
cat > out/demo.html << EOF
<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    <title>demo</title>
</head>
<body>
    <script type="text/javascript">
`uglifyjs --compress --mangle -- src/_G.js src/P.js`
    </script>
</body>
</html>
EOF
