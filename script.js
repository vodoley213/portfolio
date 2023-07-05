export const primaryHeader = document.querySelector('.primary-header')
const navToggle = document.querySelector('.mobile-nav-toggle')
const primaryNav = document.querySelector('.primary-navigation')
export const iconHamburger = document.querySelector('.icon-hamburger')

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
  primaryHeader.dataset.overlay = ''
  primaryNav.dataset.visible = ''
  iconHamburger.classList.add('hide')
})

primaryNav.addEventListener('click', e => {
  if (e.target.matches('a')) closeNavBars()
})

document.addEventListener('click', e => {
  if (e.target.matches('[data-overlay]')) closeNavBars()
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

function closeNavBars() {
  primaryNav.removeAttribute('data-visible')
  iconHamburger.classList.remove('hide')
  primaryHeader.removeAttribute('data-overlay')
}
