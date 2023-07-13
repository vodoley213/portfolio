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
window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':
      if (lastSnakeDirection.y !== 0) break
      // if (lastSnakeDirection.x === 1) afterHead = 'snake-body-BR'
      // if (lastSnakeDirection.x === -1) afterHead = 'snake-body-BL'
      snakeDirection = { x: 0, y: -1, head: 'snake-head-up' }
      break
    case 'ArrowRight':
      if (lastSnakeDirection.x !== 0) break
      // if (lastSnakeDirection.y === 1) afterHead = 'snake-body-UL'
      // if (lastSnakeDirection.y === -1) afterHead = 'snake-body-BL'
      snakeDirection = { x: 1, y: 0, head: 'snake-head-right' }
      break
    case 'ArrowDown':
      if (lastSnakeDirection.y !== 0) break
      // if (lastSnakeDirection.x === 1) afterHead = 'snake-body-UR'
      // if (lastSnakeDirection.x === -1) afterHead = 'snake-body-UL'
      snakeDirection = { x: 0, y: 1, head: 'snake-head-down' }
      break
    case 'ArrowLeft':
      if (lastSnakeDirection.x !== 0) break
      // if (lastSnakeDirection.y === 1) afterHead = 'snake-body-UR'
      // if (lastSnakeDirection.y === -1) afterHead = 'snake-body-BR'
      snakeDirection = { x: -1, y: 0, head: 'snake-head-left' }
      break
  }
})

export function getSnakeDirection() {
  lastSnakeDirection = snakeDirection
  return snakeDirection
}
