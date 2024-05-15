var esbuild = require("esbuild");

esbuild.build({
    entryPoints: [
        {
            in: "index.js",
            out: "node-i.js"
        }
    ],
    minify: true,
    platform: "node",
    outfile: "node-i.js"
})