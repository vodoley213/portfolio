const primaryHeader = document.querySelector('.primary-header')
const navToggle = document.querySelector('.mobile-nav-toggle')
const primaryNav = document.querySelector('.primary-navigation')
const iconHamburger = document.querySelector('.icon-hamburger')
const iconClose = document.querySelector('.icon-close')
const backButton = document.querySelector('.button-arrow')
const scrollWatcher = document.createElement('div')
const blurredImg = document.querySelectorAll('.blurred-img')

// Вставляем пустой див для IntersectionObserver
scrollWatcher.dataset.scrollWatcher = ''
primaryHeader.before(scrollWatcher)

navToggle.addEventListener('click', () => {
  primaryNav.hasAttribute('data-visible')
    ? navToggle.setAttribute('aria-expanded', false)
    : navToggle.setAttribute('aria-expanded', true)
  primaryNav.toggleAttribute('data-visible')
  primaryHeader.toggleAttribute('data-overlay')
  iconHamburger.classList.toggle('hide')
  iconClose.classList.toggle('hide')
})

primaryNav.addEventListener('click', e => {
  if (e.target.matches('a')) {
    primaryNav.removeAttribute('data-visible')
    primaryHeader.removeAttribute('data-overlay')
    iconClose.classList.add('hide')
    iconHamburger.classList.remove('hide')
  }
})

backButton?.addEventListener('click', () => {
  history.back()
})

const navObserver = new IntersectionObserver(entries => {
  primaryHeader.classList.toggle('sticking-nav', !entries[0].isIntersecting)
})

navObserver.observe(scrollWatcher)

// Lazy load and blur
blurredImg.forEach(div => {
  const img = div.querySelector('img')

  function loaded() {
    div.classList.add('loaded')
  }

  if (img.complete) {
    loaded()
  } else {
    img.addEventListener('load', loaded)
  }
})
