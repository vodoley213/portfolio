import { primaryHeader, iconHamburger } from '../script.js'

const snakeField = document.querySelector('#snake-field')
const fullScreenMode = document.querySelector('[data-fullscreen-icon]')

fullScreenMode.addEventListener('click', () => {
  console.log(primaryHeader)
  primaryHeader.dataset.fullscreenMode = ''
  iconHamburger.classList.add('hide')
  snakeField.classList.add('fullscreen')
})

document.addEventListener('click', e => {
  if (e.target.matches('[data-fullscreen-mode]')) normalModeScreen()
})

// --- Additional functions ---
function normalModeScreen() {
  iconHamburger.classList.remove('hide')
  primaryHeader.removeAttribute('data-fullscreen-mode')
  snakeField.classList.remove('fullscreen')
}
