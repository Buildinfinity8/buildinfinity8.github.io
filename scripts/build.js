#!/usr/bin/env node
// Pre-renders data/products.json into the static HTML pages, using the same
// markup-generating functions the browser uses (autoload/products-render.js),
// so index.html, about.html, and privacy-policy.html contain real product
// content on load — no JavaScript execution required to see it.
//
// Run this after editing data/products.json:
//   node scripts/build.js
// CI (see .github/workflows/build-products.yml) runs it automatically and
// commits the result.

const fs = require('fs')
const path = require('path')
const {
    renderFeaturedHTML,
    renderUpcomingHTML,
    renderGridHTML,
    renderAboutHTML,
    renderPrivacyHTML,
} = require('../autoload/products-render.js')

const ROOT = path.join(__dirname, '..')

const products = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'data', 'products.json'), 'utf8')
)

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function injectMarker(html, marker, content) {
    const start = `<!-- PRODUCTS:${marker} -->`
    const end = `<!-- /PRODUCTS:${marker} -->`
    const pattern = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`)

    if (!pattern.test(html)) {
        throw new Error(`Marker "${marker}" not found — expected ${start} ... ${end}`)
    }

    return html.replace(pattern, `${start}${content}${end}`)
}

function buildFile(fileName, markerContent) {
    const filePath = path.join(ROOT, fileName)
    let html = fs.readFileSync(filePath, 'utf8')

    for (const [marker, content] of Object.entries(markerContent)) {
        html = injectMarker(html, marker, content)
    }

    fs.writeFileSync(filePath, html)
    console.log(`Updated ${fileName}`)
}

buildFile('index.html', {
    FEATURED: renderFeaturedHTML(products),
    UPCOMING: renderUpcomingHTML(products),
    GRID: renderGridHTML(products, 'top'),
})

buildFile('about.html', {
    ABOUT: renderAboutHTML(products),
})

buildFile('privacy-policy.html', {
    PRIVACY: renderPrivacyHTML(products),
})
