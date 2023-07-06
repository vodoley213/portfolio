let snakeDirection = { x: 0, y: 0, head: 'right' }
let lastSnakeDirection = { x: 0, y: 0, head: 'right' }

window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':
      if (lastSnakeDirection.y !== 0) break
      snakeDirection = { x: 0, y: -1, head: 'up' }
      break
    case 'ArrowRight':
      if (lastSnakeDirection.x !== 0) break
      snakeDirection = { x: 1, y: 0, head: 'right' }
      break
    case 'ArrowDown':
      if (lastSnakeDirection.y !== 0) break
      snakeDirection = { x: 0, y: 1, head: 'down' }
      break
    case 'ArrowLeft':
      if (lastSnakeDirection.x !== 0) break
      snakeDirection = { x: -1, y: 0, head: 'left' }
      break
  }
})

export function getSnakeDirection() {
  lastSnakeDirection = snakeDirection
  return snakeDirection
}
