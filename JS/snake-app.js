import { primaryHeader, iconHamburger } from '../script.js'
import {
  SNAKE_SPEED,
  updateSnake,
  drawSnake,
  snakeIntersection,
  brownSnake,
  snakeBody,
  fieldSize,
} from './snake-app-snake.js'

import { updateMouse, drawMouse, clearMouseCount} from './snake-app-mouse.js'

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
let gameOver = false

drawSnake(snakeField)

async function updateGame(currentTime) {
  if (gameOver) {
    const gameOverPoster = document.querySelector('.game-over-poster')
    gameOverPoster.classList.add('game-over-display')
    brownSnake(snakeField)
    await resetGame(gameOverPoster)
  }

  window.requestAnimationFrame(updateGame)

  const deltaInSeconds = (currentTime - lastTime) / 1000
  if (deltaInSeconds < 1 / SNAKE_SPEED) return

  lastTime = currentTime

  updateAll()
  drawAll()
  checkForLoss()
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

function checkForLoss() {
  gameOver = snakeIntersection()
}

function resetGame(gameOverPoster) {
  return new Promise((resolve, reject) => {
    document.addEventListener(
      'keydown',
      () => {
        gameOverPoster.classList.remove('game-over-display')
        snakeBody.splice(0, snakeBody.length)
        snakeBody[0] = {
          x: Math.round(fieldSize / 2),
          y: Math.round(fieldSize / 2),
        }
        gameOver = false
        drawAll()
        clearMouseCount()
        resolve(true)
      },
      { once: true }
    )
  })
}
