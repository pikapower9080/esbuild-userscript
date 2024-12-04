import esbuild from 'esbuild'
import watch from 'recursive-watch'
import fs from 'fs'

console.time("Build for production")
if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist")
}
if (!fs.existsSync("userscript.json")) {
    console.error("userscript.json not found")
    process.exit(1)
}

function generateBanner() {
    const file = fs.readFileSync("userscript.json", "utf-8")
    let metadata
    let banner = `// ==UserScript==`
    try {
        metadata = JSON.parse(file)
    } catch(error) {
        console.error("Failed to parse userscript.json")
        console.error(error)
        process.exit(1)
    }
    for (let key in metadata) {
        let value = metadata[key]
        if (typeof(value) == "string") {
            banner += `\n// @${key} ${value}`
        } else if (typeof(value) == "object" && Array.isArray(value)) {
            for (let val of value) {
                banner += `\n// @${key} ${val}`
            }
        } else {
            console.warn(`Invalid value for key ${key}`)
        }
    }
    banner += `\n// ==/UserScript==\n\n`

    if (fs.existsSync("src/styles.css")) {
        const css = btoa(fs.readFileSync("src/styles.css", "utf-8"))
        banner += `const injectedStyles=document.createElement("style");`
        banner += `injectedStyles.innerHTML=atob("${css}");`
        banner += `document.head.appendChild(injectedStyles);\n`
    }

    return banner
}

if (process.env.NODE_ENV == "development") {
    console.log("Starting development server...")
    function rebuild(filename) {
        console.time(filename || "Development build")
        esbuild.build({
            entryPoints: ["src/index.js"],
            bundle: true,
            minify: false,
            outfile: "dist/index.js",
            sourcemap: "inline",
            banner: {
                js: generateBanner()
            }
        }).catch(() => {
            console.error("Failed to build")
        }).then(() => {
            console.timeEnd(filename || "Development build")
        })
    }
    watch('src', (filename) => {
        console.time(`${filename}`)
        rebuild()
    })
    watch('userscript.json', () => {
        console.time("userscript.json")
        rebuild("userscript.json")
    })
    rebuild()
} else {
    esbuild.buildSync({
        entryPoints: ["src/index.js"],
        bundle: true,
        minify: true,
        outfile: "dist/index.js",
        banner: {
            js: generateBanner()
        }
    })
    console.timeEnd("Build for production")
}

