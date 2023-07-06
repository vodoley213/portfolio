import { getSnakeDirection } from './snake-app-input.js'
export const SNAKE_SPEED = 1 /* how many moves per second*/

const field = document.querySelector('#snake-field')
const fieldSize = getComputedStyle(field).getPropertyValue('--field-size')
const snakeBody = [
  { x: Math.round(fieldSize / 2), y: Math.round(fieldSize / 2) },
]
let newSnakeParts = 0

// console.log(FIELD_SIZE)

export function updateSnake() {
  addSnakeParts()
  const snakeDirection = getSnakeDirection()
  let newX = snakeBody[0].x + snakeDirection.x
  let newY = snakeBody[0].y + snakeDirection.y
  console.log(fieldSize)
  if (newX === 0) newX = +fieldSize
  if (newX === +fieldSize + 1) newX = 1
  if (newY === 0) newY = +fieldSize
  if (newY === +fieldSize + 1) newY = 1
  const newSnakeHead = { x: newX, y: newY }
  snakeBody.unshift(newSnakeHead)
  snakeBody.pop()
}

export function drawSnake(snakeField) {
  snakeBody.forEach((segment, index) =>
    appendSnakePart(segment, index, snakeField)
  )
}

export function snakeGrowth(amount) {
  newSnakeParts += amount
}

export function eated(mouse) {
  return snakeBody.some(snakePart => {
    return comparePositions(snakePart, mouse)
  })
}

// --- Additional functions ---
function appendSnakePart(segment, index, snakeField) {
  const snakePart = document.createElement('div')
  snakePart.style.gridColumnStart = segment.x
  snakePart.style.gridRowStart = segment.y
  const headDirection = getSnakeDirection().head
  if (index === 0) {
    snakePart.classList.add(`snake-head-${headDirection}`)
  } else {
    snakePart.classList.add('snake')
  }
  snakeField.append(snakePart)
}

function comparePositions(snakePart, mouse) {
  return snakePart.x === mouse.x && snakePart.y === mouse.y
}

function addSnakeParts() {
  for (let i = 0; i < newSnakeParts; i++) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] })
  }
  newSnakeParts = 0
}
