// Shared header/footer template for every page on the site.
// Any page that includes an empty <header></header> and/or <footer></footer>,
// plus `<script defer src="autoload/autoload.js"></script>`, gets these filled in
// automatically on load.

const HEADER_HTML = `
    <a id="logo" href="index.html">
        <img src="logo/logo.png" alt="Omnori Logo">
        <span>Omnori</span>
    </a>
    <div class="navi">
        <a href="index.html#products"> Products </a>
        <a href="services.html"> Services</a>
        <!-- <a href="index.html#giveidea"> Give Ideas </a> -->
        <a href="about.html"> About</a>
    </div>
    <div class="socials">
        <a href="https://www.instagram.com/omnori.tech" target="_blank" rel="noopener"><img src="https://img.icons8.com/?size=100&id=85140&format=png&color=000000" alt="Instagram"></a>
        <a href="https://github.com/omnori" target="_blank" rel="noopener"><img src="https://img.icons8.com/?size=100&id=106567&format=png&color=000000" alt="GitHub"></a>
        <a href="https://discord.gg/5ag9gjsDde" target="_blank" rel="noopener"><img src="https://img.icons8.com/?size=100&id=86982&format=png&color=000000" alt="Discord"></a>
    </div>
    <button id="navToggle" class="navtoggle" aria-label="Toggle navigation" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
    </button>
`

const FOOTER_HTML = `
    <div class="footertop">
        <div class="footerbrand">
            <a class="brandlogo" href="index.html">
                <img src="logo/logo.png" alt="Omnori Logo">
                <span>Omnori</span>
            </a>
            <p>We give businesses software and marketing services and build tools to solve their problems. When we spot the same problem again and again, we turn that tool into a SaaS product anyone can use.</p>
            <div class="socials">
                <a href="https://www.instagram.com/omnori.tech" target="_blank" rel="noopener"><img src="https://img.icons8.com/?size=100&id=85140&format=png&color=f1f1f1" alt="Instagram"></a>
                <a href="https://github.com/omnori" target="_blank" rel="noopener"><img src="https://img.icons8.com/?size=100&id=106567&format=png&color=f1f1f1" alt="GitHub"></a>
                <a href="https://discord.gg/5ag9gjsDde" target="_blank" rel="noopener"><img src="https://img.icons8.com/?size=100&id=86982&format=png&color=f1f1f1" alt="Discord"></a>
            </div>
        </div>
        <div class="footerlinks">
            <div class="linkcol">
                <h4>Explore</h4>
                <a href="index.html#products">Products</a>
                <a href="services.html">Services</a>
                <!-- <a href="index.html#giveidea">Give Idea</a> -->
            </div>
            <div class="linkcol">
                <h4>Company</h4>
                <a href="privacy-policy.html">Privacy Policy</a>
                <a href="contact.html">Contact</a>
            </div>
        </div>
    </div>
    <div class="footerbottom">
        <p>&copy; 2026 Omnori. All rights reserved.</p>
        <p>Software, marketing services, and SaaS products.</p>
    </div>
`

// On the homepage itself, same-page anchors should scroll smoothly instead of
// navigating to "index.html#section" (which would force a full page reload).
function isHomePage() {
    const path = location.pathname
    return path === '/' || path === '' || /\/index\.html$/.test(path)
}

function renderTemplate(html) {
    return isHomePage() ? html.replace(/href="index\.html#/g, 'href="#') : html
}

function initNavToggle() {
    const navToggle = document.getElementById('navToggle')
    const navi = document.querySelector('header .navi')

    if (!navToggle || !navi) return

    const closeNav = () => {
        navi.classList.remove('open')
        navToggle.classList.remove('open')
        navToggle.setAttribute('aria-expanded', 'false')
    }

    navToggle.addEventListener('click', () => {
        const isOpen = navi.classList.toggle('open')
        navToggle.classList.toggle('open', isOpen)
        navToggle.setAttribute('aria-expanded', String(isOpen))
    })

    navi.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav))

    document.addEventListener('click', (e) => {
        if (!navi.classList.contains('open')) return
        if (!navi.contains(e.target) && !navToggle.contains(e.target)) closeNav()
    })
}

document.querySelectorAll('header').forEach(el => {
    el.innerHTML = renderTemplate(HEADER_HTML)
})

document.querySelectorAll('footer').forEach(el => {
    el.innerHTML = renderTemplate(FOOTER_HTML)
})

initNavToggle()
