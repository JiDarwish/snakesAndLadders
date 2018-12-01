// /////////////////////////////////////time of game
const gameTimer = setInterval(incTimeSinceStart, 1000)
let secs = 0

function incTimeSinceStart() {
  const minutes = document.getElementById('minutes')
  const seconds = document.getElementById('seconds')
  secs++ // inc seconds

  const newSeconds = secs % 60
  const newMinutes = parseInt(secs / 60, 10)

  seconds.innerText = newSeconds < 10 ? '0' + newSeconds : newSeconds
  minutes.innerText = newMinutes < 10 ? '0' + newMinutes : newMinutes
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
