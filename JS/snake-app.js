import { primaryHeader, iconHamburger } from '../script.js'
import { SNAKE_SPEED, updateSnake, drawSnake } from './snake-app-snake.js'

import { updateMouse, drawMouse } from './snake-app-mouse.js'

const snakeField = document.querySelector('#snake-field')

const fullScreenMode = document.querySelector('[data-fullscreen-icon]')

fullScreenMode.addEventListener('click', () => {
  SwitchToFullscreenMode()
})

document.addEventListener('click', e => {
  if (e.target.matches('[data-fullscreen-mode]')) SwitchToNormalModeScreen()
})

// -- Main game loop --

let lastTime = 0

drawSnake(snakeField)

function updateGame(currentTime) {
  window.requestAnimationFrame(updateGame)

  const deltaInSeconds = (currentTime - lastTime) / 1000
  if (deltaInSeconds < 1 / SNAKE_SPEED) return

  lastTime = currentTime

  updateAll()
  drawAll()
}

window.requestAnimationFrame(updateGame)

// --- Additional functions ---
function SwitchToFullscreenMode() {
  iconHamburger.classList.add('hide')
  primaryHeader.dataset.fullscreenMode = ''
  snakeField.classList.add('fullscreen')
}

function SwitchToNormalModeScreen() {
  iconHamburger.classList.remove('hide')
  primaryHeader.removeAttribute('data-fullscreen-mode')
  snakeField.classList.remove('fullscreen')
}

function updateAll() {
  updateSnake()
  updateMouse()
}

function drawAll() {
  snakeField.innerHTML = ''
  drawSnake(snakeField)
  drawMouse(snakeField)
}
