import { snakeGrowth, eatedOrOnSnake, fieldSize } from './snake-app-snake.js'

let mouse = randomMousePosition()
const GROWS_RATE = 1
let mouseCount = 0

export function updateMouse() {
  if (eatedOrOnSnake(mouse)) {
    mouseCount++
    const score = document.querySelector('.score')
    score.textContent = mouseCount
    score.dataset.howManyMouses = ''

    snakeGrowth(GROWS_RATE)
    mouse = randomMousePosition()
    setTimeout(() => {
      score.removeAttribute('data-how-many-mouses')
    }, 1400)
  }
}

export function drawMouse(snakeField) {
  const mouseElement = document.createElement('div')
  mouseElement.style.gridColumnStart = mouse.x
  mouseElement.style.gridRowStart = mouse.y
  mouseElement.classList.add('mouse')

  snakeField.append(mouseElement)
}

function randomMousePosition() {
  let newMousePosition
  while (newMousePosition == null || eatedOrOnSnake(newMousePosition)) {
    newMousePosition = randomPositionOnField()
  }
  return newMousePosition
}

function randomPositionOnField() {
  return {
    x: Math.floor(Math.random() * fieldSize) + 1,
    y: Math.floor(Math.random() * fieldSize) + 1,
  }
}

export function clearMouseCount() {
  mouseCount = 0
}
