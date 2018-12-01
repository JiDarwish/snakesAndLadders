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

////////////////////////////////////////time of game

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

/////////////////////////////////////////// ROLL THE DICE EFFECT
const rollDiceBtn = document.getElementById('rollDiceBtn')
rollDiceBtn.onclick = rollDice

function rollDice(e) {
  const dice = document.getElementById('diceImg')
  const gotten = Math.floor(Math.random() * 6) + 1

  dice.classList.toggle('diceImg-active')
  setTimeout(() => {
    dice.childNodes[1].setAttribute('src', '/images/dice' + gotten + '.png')
  }, 600)
  // setTimeout(
  //   () => dice.childNodes[1].setAttribute('src', '/images/whole-dice.png'),
  //   2750
  // )
}
