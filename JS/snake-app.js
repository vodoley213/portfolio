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

import {
  updateMouse,
  drawMouse,
  clearMouseCount,
  mouseCount,
} from './snake-app-mouse.js'

const STORAGE_PREFIX = 'SNAKE_APP'
const HISCORE_STORAGE_KEY = `${STORAGE_PREFIX}-HISCORE`

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
    let gameOverPoster
    brownSnake(snakeField)

    const isNewRecord = checkLSforRecord()
    console.log(isNewRecord)
    if (isNewRecord) {
      setHiScoreToStorage()
      gameOverPoster = document.querySelector('.new-record-poster')
      const mouseCountInPoster = document.querySelector('[data-mouse-count]')
      mouseCountInPoster.textContent = mouseCount
    } else {
      gameOverPoster = document.querySelector('.game-over-poster')
    }

    gameOverPoster.classList.add('game-over-display')

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
    const events = ['keydown', 'touchstart']

    events.forEach(event => {
      document.addEventListener(
        event,
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
  })
}

function setHiScoreToStorage() {
  localStorage.setItem(HISCORE_STORAGE_KEY, JSON.stringify(mouseCount))
}

function checkLSforRecord() {
  const lastRecord = localStorage.getItem(HISCORE_STORAGE_KEY)
  if (lastRecord == null || JSON.parse(lastRecord) < mouseCount) {
    return true
  } else {
    return false
  }
}
