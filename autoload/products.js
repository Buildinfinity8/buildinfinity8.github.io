// Products pipeline: fetches data/products.json and re-renders every product
// listing across the site (homepage Featured + Upcoming spotlights and
// Products grid, the About page's "What We Build" list, and the Privacy
// Policy's per-product data sections) using the shared renderers in
// autoload/products-render.js.
//
// The HTML those renderers produce is also pre-baked into each page at
// commit time by scripts/build.js, so this script is a progressive
// enhancement (mainly the Latest/Top toggle) rather than the only way the
// content appears — crawlers that don't run JS still see real content.
//
// To add, remove, or edit a product, edit data/products.json and run
// `node scripts/build.js` — nothing in the HTML needs to change by hand.

const PRODUCTS_JSON_PATH = 'data/products.json'

function bind(selector, html) {
    const el = document.querySelector(selector)
    if (el) el.innerHTML = html
}

function initGridFilter(products) {
    const buttons = document.querySelectorAll('#products .heading .tags button')
    if (!buttons.length) return

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'))
            btn.classList.add('active')
            bind('#productsList', ProductsRender.renderGridHTML(products, btn.dataset.filter))
        })
    })
}

fetch(PRODUCTS_JSON_PATH)
    .then(res => res.json())
    .then(products => {
        bind('#featuredSpotlight', ProductsRender.renderFeaturedHTML(products))
        bind('#upcomingSpotlight', ProductsRender.renderUpcomingHTML(products))
        bind('#productsList', ProductsRender.renderGridHTML(products, 'top'))
        bind('#aboutProductList', ProductsRender.renderAboutHTML(products))
        bind('#privacyProductSections', ProductsRender.renderPrivacyHTML(products))
        initGridFilter(products)
    })
    .catch(err => console.error('Failed to load products:', err))
