import { getSnakeDirection } from './snake-app-input.js'
export let SNAKE_SPEED = 4 /* how many moves per second*/

snakeSpeedControl()

const field = document.querySelector('#snake-field')
export const fieldSize =
  getComputedStyle(field).getPropertyValue('--field-size')
export const snakeBody = [
  {
    x: Math.round(fieldSize / 2),
    y: Math.round(fieldSize / 2),
  },
]
let newSnakeParts = 0

export function updateSnake() {
  addSnakeParts()
  const snakeDirection = getSnakeDirection()
  const headDirection = snakeDirection.head
  let newX = snakeBody[0].x + snakeDirection.x
  let newY = snakeBody[0].y + snakeDirection.y

  if (newX === 0) newX = +fieldSize
  if (newX === +fieldSize + 1) newX = 1
  if (newY === 0) newY = +fieldSize
  if (newY === +fieldSize + 1) newY = 1
  const newSnakeHead = { x: newX, y: newY, head: headDirection }
  snakeBody.unshift(newSnakeHead)
  snakeBody.pop()

  getSnakeShape(snakeBody)
}

export function drawSnake(snakeField, { brownColor = false } = {}) {
  snakeBody.forEach(segment => appendSnakePart(segment, snakeField, brownColor))
}

export function snakeGrowth(amount) {
  newSnakeParts += amount
}

export function eatedOrOnSnake(mouse, { ignoreHead = false } = {}) {
  return snakeBody.some((snakePart, index) => {
    if (ignoreHead && index === 0) return false
    return comparePositions(snakePart, mouse)
  })
}

export function snakeIntersection() {
  return eatedOrOnSnake(snakeBody[0], { ignoreHead: true })
}

export function brownSnake(snakeField) {
  drawSnake(snakeField, { brownColor: true })
}

// --- Additional functions ---
function appendSnakePart(segment, snakeField, brownColor) {
  const snakePart = document.createElement('div')
  snakePart.style.gridColumnStart = segment.x
  snakePart.style.gridRowStart = segment.y
  const shape = segment.shape
  snakePart.classList.add(shape)
  if (brownColor) snakePart.classList.add('brown-snake')
  snakeField.append(snakePart)
}

function getSnakeShape(snakeBody) {
  snakeBody[0].shape = snakeBody[0].head
  const snakeLength = snakeBody.length

  if (snakeLength === 1) return

  // --- Форма хвоста: ---
  if (snakeBody[snakeLength - 1].x > snakeBody[snakeLength - 2].x)
    snakeBody[snakeLength - 1].shape = 'tail-right'

  if (snakeBody[snakeLength - 1].x < snakeBody[snakeLength - 2].x)
    snakeBody[snakeLength - 1].shape = 'tail-left'

  if (snakeBody[snakeLength - 1].y > snakeBody[snakeLength - 2].y)
    snakeBody[snakeLength - 1].shape = 'tail-down'

  if (snakeBody[snakeLength - 1].y < snakeBody[snakeLength - 2].y)
    snakeBody[snakeLength - 1].shape = 'tail-up'

  if (snakeLength === 2) return

  // --- Форма тела: ---
  for (let segment = 1; segment < snakeLength - 1; segment++) {
    // если x(i-1) = x(i) = x(i+1) или y(i-1) = yi = y(i+1), то второй элемент – N;
    if (
      snakeBody[segment - 1].x === snakeBody[segment].x &&
      snakeBody[segment].x === snakeBody[segment + 1].x
    ) {
      snakeBody[segment].shape = 'snake-body-N'
      return
    }
    if (
      snakeBody[segment - 1].y === snakeBody[segment].y &&
      snakeBody[segment].y === snakeBody[segment + 1].y
    ) {
      snakeBody[segment].shape = 'snake-body-N'
      return
    }

    // если x(i-1) = xi и y(i-1) > yi и xi < x(i+1) и yi = y(i+1), то второй элемент – UL;
    if (
      snakeBody[segment - 1].x === snakeBody[segment].x &&
      snakeBody[segment - 1].y > snakeBody[segment].y &&
      snakeBody[segment].x < snakeBody[segment + 1].x &&
      snakeBody[segment].y === snakeBody[segment + 1].y
    ) {
      snakeBody[segment].shape = 'snake-body-UL'
      return
    }

    // если x(i-1) > xi и y(i-1) = yi и xi = x(i+1) и yi < y(i+1), то второй элемент – UL;
    if (
      snakeBody[segment - 1].x > snakeBody[segment].x &&
      snakeBody[segment - 1].y === snakeBody[segment].y &&
      snakeBody[segment].x === snakeBody[segment + 1].x &&
      snakeBody[segment].y < snakeBody[segment + 1].y
    ) {
      snakeBody[segment].shape = 'snake-body-UL'
      return
    }

    // если x(i-1) < xi и y(i-1) = yi и xi = x(i+1) и yi < y(i+1), то второй элемент – UR;
    if (
      snakeBody[segment - 1].x < snakeBody[segment].x &&
      snakeBody[segment - 1].y === snakeBody[segment].y &&
      snakeBody[segment].x === snakeBody[segment + 1].x &&
      snakeBody[segment].y < snakeBody[segment + 1].y
    ) {
      snakeBody[segment].shape = 'snake-body-UR'
      return
    }

    // если x(i-1) = xi и y(i-1) > yi и xi > x(i+1) и yi = y(i+2), то второй элемент – UR;
    if (
      snakeBody[segment - 1].x === snakeBody[segment].x &&
      snakeBody[segment - 1].y > snakeBody[segment].y &&
      snakeBody[segment].x > snakeBody[segment + 1].x &&
      snakeBody[segment].y === snakeBody[segment + 1].y
    ) {
      snakeBody[segment].shape = 'snake-body-UR'
      return
    }

    // если x(i-1) < xi и y(i-1) = yi и xi = x(i+1) и yi > y(i+1), то второй элемент – BR;
    if (
      snakeBody[segment - 1].x < snakeBody[segment].x &&
      snakeBody[segment - 1].y === snakeBody[segment].y &&
      snakeBody[segment].x === snakeBody[segment + 1].x &&
      snakeBody[segment].y > snakeBody[segment + 1].y
    ) {
      snakeBody[segment].shape = 'snake-body-BR'
      return
    }

    // если x(i-1) = xi и y(i-1) < yi и xi > x(i+1) и yi = y(i+1), то второй элемент – BR;
    if (
      snakeBody[segment - 1].x === snakeBody[segment].x &&
      snakeBody[segment - 1].y < snakeBody[segment].y &&
      snakeBody[segment].x > snakeBody[segment + 1].x &&
      snakeBody[segment].y === snakeBody[segment + 1].y
    ) {
      snakeBody[segment].shape = 'snake-body-BR'
      return
    }

    // если x(i-1) = xi и y(i-1) < yi и xi < x(i+1) и yi = y(i+1), то второй элемент – BL;
    if (
      snakeBody[segment - 1].x === snakeBody[segment].x &&
      snakeBody[segment - 1].y < snakeBody[segment].y &&
      snakeBody[segment].x < snakeBody[segment + 1].x &&
      snakeBody[segment].y === snakeBody[segment + 1].y
    ) {
      snakeBody[segment].shape = 'snake-body-BL'
      return
    }

    // если x(i-1) > xi и y(i-1) = yi и xi = x(i+1) и yi > y(i+1), то второй элемент – BL;
    if (
      snakeBody[segment - 1].x > snakeBody[segment].x &&
      snakeBody[segment - 1].y === snakeBody[segment].y &&
      snakeBody[segment].x === snakeBody[segment + 1].x &&
      snakeBody[segment].y > snakeBody[segment + 1].y
    ) {
      snakeBody[segment].shape = 'snake-body-BL'
      return
    }
    snakeBody[segment].shape = 'snake-body-N'
  }

  console.table(snakeBody)
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

function snakeSpeedControl() {
  document.addEventListener('keydown', e => {
    switch (e.key) {
      case '+':
        SNAKE_SPEED += 0.1
        console.log(SNAKE_SPEED)
        break
    }
    switch (e.key) {
      case '-':
        SNAKE_SPEED -= 0.1
        console.log(SNAKE_SPEED)
        break
    }
  })
}
