let snakeDirection = {
  x: 0,
  y: 0,
  head: 'snake-head-right',
}
let lastSnakeDirection = {
  x: 0,
  y: 0,
  head: 'snake-head-right',
}

const snakeBoard = document.querySelector('#snake-field')

window.addEventListener('keydown', pythonСontrolKeyboard)

snakeBoard.addEventListener('touchstart', pythonСontrolSmartphone)

function pythonСontrolKeyboard(e) {
  {
    switch (e.key) {
      case 'ArrowUp':
        if (lastSnakeDirection.y !== 0) break
        snakeDirection = { x: 0, y: -1, head: 'snake-head-up' }
        break
      case 'ArrowRight':
        if (lastSnakeDirection.x !== 0) break
        snakeDirection = { x: 1, y: 0, head: 'snake-head-right' }
        break
      case 'ArrowDown':
        if (lastSnakeDirection.y !== 0) break
        snakeDirection = { x: 0, y: 1, head: 'snake-head-down' }
        break
      case 'ArrowLeft':
        if (lastSnakeDirection.x !== 0) break
        snakeDirection = { x: -1, y: 0, head: 'snake-head-left' }
        break
    }
  }
}

function pythonСontrolSmartphone(e) {
  const snakeFieldSize = snakeBoard.getBoundingClientRect()
  const snakeFieldCenterX = (snakeFieldSize.left + snakeFieldSize.right) / 2
  const snakeFieldCenterY = (snakeFieldSize.top + snakeFieldSize.bottom) / 2
  const deltaX = e.touches[0].clientX - snakeFieldCenterX
  const deltaY = e.touches[0].clientY - snakeFieldCenterY

  if (deltaX < 0 && deltaY < 0 && Math.abs(deltaX) < Math.abs(deltaY)) {
    if (lastSnakeDirection.y !== 0) return
    snakeDirection = { x: 0, y: -1, head: 'snake-head-up' }
    return
  }
  if (deltaX > 0 && deltaY < 0 && Math.abs(deltaX) < Math.abs(deltaY)) {
    if (lastSnakeDirection.y !== 0) return
    snakeDirection = { x: 0, y: -1, head: 'snake-head-up' }
    return
  }

  if (deltaX > 0 && deltaY > 0 && deltaX > deltaY) {
    if (lastSnakeDirection.x !== 0) return
    snakeDirection = { x: 1, y: 0, head: 'snake-head-right' }
    return
  }
  if (deltaX > 0 && deltaY < 0 && deltaX > Math.abs(deltaY)) {
    if (lastSnakeDirection.x !== 0) return
    snakeDirection = { x: 1, y: 0, head: 'snake-head-right' }
    return
  }

  if (deltaX > 0 && deltaY > 0 && deltaX < deltaY) {
    if (lastSnakeDirection.y !== 0) return
    snakeDirection = { x: 0, y: 1, head: 'snake-head-down' }
    return
  }
  if (deltaX < 0 && deltaY > 0 && Math.abs(deltaX) < deltaY) {
    if (lastSnakeDirection.y !== 0) return
    snakeDirection = { x: 0, y: 1, head: 'snake-head-down' }
    return
  }

  if (deltaX < 0 && deltaY < 0 && Math.abs(deltaX) > Math.abs(deltaY)) {
    if (lastSnakeDirection.x !== 0) return
    snakeDirection = { x: -1, y: 0, head: 'snake-head-left' }
    return
  }
  if (deltaX < 0 && deltaY > 0 && Math.abs(deltaX) > Math.abs(deltaY)) {
    if (lastSnakeDirection.x !== 0) return
    snakeDirection = { x: -1, y: 0, head: 'snake-head-left' }
    return
  }
}

export function getSnakeDirection() {
  lastSnakeDirection = snakeDirection
  return snakeDirection
}
