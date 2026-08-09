// Pure HTML-string renderers for product listings — no DOM, no fetch.
// Shared by autoload/products.js (runs in the browser, for the live
// Latest/Top toggle) and scripts/build.js (runs in Node at commit time, to
// pre-render this same markup into the static HTML for crawlers that don't
// execute JavaScript).
//
// Keep all product markup decisions here so the two callers never drift.

;(function (root) {
    const LINK_ICON = 'https://img.icons8.com/?size=100&id=85504&format=png&color=f1f1f1'
    const FEATURED_LIMIT = 2
    const GRID_LIMIT = 6

    function byUsersDesc(a, b) {
        return b.users - a.users
    }

    function byDateAddedDesc(a, b) {
        return new Date(b.dateAdded) - new Date(a.dateAdded)
    }

    function tagSpans(tags) {
        return tags.map(tag => `<span>${tag}</span>`).join(' ')
    }

    function renderFeaturedHTML(products) {
        const featured = products
            .filter(p => p.status === 'live')
            .sort(byUsersDesc)
            .slice(0, FEATURED_LIMIT)

        return featured.map(p => `
        <div class="pritem">
            <img class="appicon" src="${p.logo}" alt="">
            <div class="apptext">
                <h3>${p.name}</h3>
                <div class="tags">
                    ${tagSpans(p.tags.slice(0, 2))}
                    <span>${p.users} users</span>
                </div>
            </div>
        </div>
    `).join('')
    }

    function renderUpcomingHTML(products) {
        const upcoming = products.filter(p => p.status === 'upcoming')

        return upcoming.map(p => `
        <div class="pritem">
            <img class="appicon" src="${p.logo}" alt="">
            <div class="apptext">
                <h3>${p.name}</h3>
                <div class="tags">
                    ${tagSpans(p.tags.slice(0, 3))}
                </div>
            </div>
        </div>
    `).join('')
    }

    function renderGridHTML(products, filter) {
        const sorted = filter === 'latest'
            ? [...products].sort(byDateAddedDesc)
            : [...products].sort(byUsersDesc)

        const items = sorted.slice(0, GRID_LIMIT)

        return items.map(p => {
            const tags = [...p.tags]
            if (p.users > 0) tags.unshift(`${p.users} users`)
            if (p.status === 'upcoming') tags.push('Coming Soon')

            const action = p.link
                ? `<a class="itembtn" href="${p.link}" target="_blank" rel="noopener"><img src="${LINK_ICON}" alt=""></a>`
                : `<button><img src="${LINK_ICON}" alt=""></button>`

            return `
            <div class="item">
                <div class="logo">
                    <img src="${p.logo}" alt="">
                </div>
                <div class="context">
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <div class="tags">${tagSpans(tags)}</div>
                </div>
                ${action}
            </div>
        `
        }).join('')
    }

    function renderAboutHTML(products) {
        return products.map(p => `
        <li><strong>${p.name}</strong>${p.status === 'upcoming' ? ' <em>(coming soon)</em>' : ''} — ${p.description}</li>
    `).join('')
    }

    function renderPrivacyHTML(products) {
        return products
            .filter(p => p.privacy && p.privacy.length)
            .map(p => `
            <h3>${p.name}</h3>
            <ul>
                ${p.privacy.map(item => `<li><strong>${item.label}:</strong> ${item.text}</li>`).join('')}
            </ul>
        `).join('')
    }

    const ProductsRender = {
        renderFeaturedHTML,
        renderUpcomingHTML,
        renderGridHTML,
        renderAboutHTML,
        renderPrivacyHTML,
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ProductsRender
    } else {
        root.ProductsRender = ProductsRender
    }
})(typeof window !== 'undefined' ? window : globalThis)
