import { snakeGrowth, eated } from './snake-app-snake.js'

let mouse = { x: 2, y: 1 }
const GROWS_RATE = 1

export function updateMouse() {
  if (eated(mouse)) {
    snakeGrowth(GROWS_RATE)
    mouse = { x: 20, y: 10 }
  }
}

export function drawMouse(snakeField) {
  const mouseElement = document.createElement('div')
  mouseElement.style.gridColumnStart = mouse.x
  mouseElement.style.gridRowStart = mouse.y
  mouseElement.classList.add('mouse')

  snakeField.append(mouseElement)
}
