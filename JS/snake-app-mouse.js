import { snakeGrowth, eatedOrOnSnake, fieldSize } from './snake-app-snake.js'

let mouse = randommousePosition()
const GROWS_RATE = 1

export function updateMouse() {
  if (eatedOrOnSnake(mouse)) {
    snakeGrowth(GROWS_RATE)
    mouse = randommousePosition()
  }
}

export function drawMouse(snakeField) {
  const mouseElement = document.createElement('div')
  mouseElement.style.gridColumnStart = mouse.x
  mouseElement.style.gridRowStart = mouse.y
  mouseElement.classList.add('mouse')

  snakeField.append(mouseElement)
}

function randommousePosition() {
  let newMousePosition
  while (newMousePosition == null || eatedOrOnSnake(newMousePosition)) {
    newMousePosition = randimPositionOnField()
  }
  return newMousePosition
}

function randimPositionOnField() {
  return {
    x: Math.floor(Math.random() * fieldSize) + 1,
    y: Math.floor(Math.random() * fieldSize) + 1,
  }
}
