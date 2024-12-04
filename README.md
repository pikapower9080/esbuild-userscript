# esbuild-userscript

Template for creating a Tampermonkey/GreaseMonkey userscript with esbuild.

## Required Tools
- [Bun](https://bun.sh/)
- Git

## Quick Start
1. Clone the repo
```sh
git clone https://github.com/pikapower9080/esbuild-userscript
cd esbuild-userscript
```
2. Create a clean git repo
```sh
rm -rf .git
git init
```
3. Install dependencies:
```sh
bun install
```
4. Modify `userscript.json` to your liking.
```json
{
    "name": "My Userscript",
    "namespace": "http://tampermonkey.net/",
    "version": "1.0.0",
    "author": "you",
    "match": [
        "https://example.com/page1",
        "https://example.com/page2"
    ],
    "icon": "https://example.com/icon.png",
    "grant": ["GM.setValue", "GM.getValue"]
}
```
5. Start the development server
```sh
bun run dev
```
6. Make changes to `src/index.js`
7. Check for changes in `dist/index.js`
8. Run a production build
```sh
bun run build
```