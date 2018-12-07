//////////////////////////////////////// Random colors
randomizeCellColors()

function randomizeCellColors() {
  const cells = document.getElementsByClassName('cell')
  const possibleColors = ['red', 'blue', 'green', 'yellow']

  for (const cell of cells) {
    cell.style.backgroundColor =
      possibleColors[Math.floor(Math.random() * possibleColors.length - 1) + 1]
  }
}

////////////////////////////////////////////// FULL SCREEN

const fullScreenBtn = document.getElementById('fullScreenBtn')

fullScreenBtn.addEventListener('click', fullScreen)

function fullScreen(e) {
  const elem = document.documentElement

  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen()
  }
}

const returnToHomeBtn = document.getElementById('returnToHome')

returnToHomeBtn.addEventListener('click', e => {
  window.location.href = '/'
})
