// Message types is in the html file prior to that so it does exist

const socket = new WebSocket('ws://localhost:3000')

socket.onclose = function(e) {
  socket.send(JSON.stringify({ type: messageTypes.PLAYER_LEFT }))
}

socket.onopen = function(e) {
  socket.onmessage = function(m) {
    const msg = JSON.parse(m.data) // parse the received message

    console.log(msg)

    switch (msg.type) {
      case messageTypes.START_GAME:
        startGame()
        makeAnnouncement('Ready, Set, GO!')
        break
      case messageTypes.MOVE_PIN:
        handleMovingPin(msg.content)
        const { newPos, playersName, diceVal } = msg.content
        makeAnnouncement(
          'player ' +
            playersName +
            ' got a ' +
            diceVal +
            ' And moved to ' +
            newPos
        )
        break
      case messageTypes.PLAYER_NAMES:
        addPlayersNames(msg.content)
        break
      case messageTypes.TURN_CHANGE:
        changeTurns()
        break
      case messageTypes.BROADCAST_TURN:
        broadcastTurn(msg.content)
        break
      case messageTypes.END_GAME:
        endGame(msg.content)
        makeAnnouncement('Game ended! Player ' + msg.content.winner + ' won!')
        break
      default:
        console.log('default hit')
    }
  }
}

function makeAnnouncement(text) {
  const announcementArea = document.getElementById('announcementsContent')
  announcementArea.innerText = text
}

/////////////////////////////////////////////// BROAD CAST TURN
function broadcastTurn({ playerName }) {
  document.getElementById('whosTurn').innerText = playerName
}
/////////////////////////////////////////////// HANDLE CHANGE TURNS
function changeTurns() {
  document.getElementById('rollDiceBtn').disabled = false
}

////////////////////////////////////////////////// Display dice val
function displayDiceVal(diceVal) {
  const diceImg = document.getElementById('diceImg').children[0]
  diceImg.setAttribute('src', '/images/dice' + diceVal + '.png')
}
//////////////////////////////////////////////// HANDLER DICE ROLL
function handleMovingPin({ newPos, playersName, diceVal }) {
  if (typeof diceVal === 'number') {
    displayDiceVal(diceVal)
  } else {
    // SAY HE GOT A SNAKE OR
  }

  const playerAName = document.getElementById('playerA').innerText
  let pin

  if (playersName === playerAName) {
    pin = document.getElementById('pinPlayerA')
  } else {
    pin = document.getElementById('pinPlayerB')
  }
  movePin(pin, newPos)
}

function movePin(pinEl, newPos) {
  const targetCell = document.getElementsByClassName('cell' + newPos)[0]
  const board = document.getElementById('board')
  pinEl.style.left = targetCell.offsetLeft - board.offsetLeft + 20 + 'px'
  pinEl.style.top = targetCell.offsetTop - board.offsetTop + 20 + 'px'
}

////////////////////////////////////////////// ADD PLAYERS NAME TO SCREEN AS IT COMES IN
function addPlayersNames({ playerA, playerB }) {
  const playerASpot = document.getElementById('playerA')
  const pinPlayerA = document.getElementById('pinPlayerA')
  playerASpot.innerText = playerA
  pinPlayerA.innerText = playerA

  if (playerB) {
    const playerBSpot = document.getElementById('playerB')
    const pinPlayerB = document.getElementById('pinPlayerB')
    playerBSpot.innerText = playerB
    pinPlayerB.innerText = playerB
  }
}

///////////////////////////////////////////////////////// START THE GAME
function startGame() {
  initiateTimer()
}

/////////////////////////////////////////////// REGISTER PLAYER
const playerNameForm = document.getElementById('playerNameForm')

playerNameForm.addEventListener('submit', async e => {
  e.preventDefault()
  const playerName = e.target.children[2].value.trim()
  if (!playerName) {
    console.log('Make him enter his name')
    return
  }

  await socket.send(
    JSON.stringify({
      type: messageTypes.ADD_PLAYER,
      content: playerName
    })
  )

  const modal = document.getElementById('modal')
  modal.style.display = 'none'
})

//////////////////////////////////////// time of game
let gameTimer = null
let secs = 0

function initiateTimer() {
  gameTimer = setInterval(incTimeSinceStart, 1000)
}

function incTimeSinceStart() {
  const minutes = document.getElementById('minutes')
  const seconds = document.getElementById('seconds')
  secs++ // inc seconds

  const newSeconds = secs % 60
  const newMinutes = parseInt(secs / 60, 10)

  seconds.innerText = newSeconds < 10 ? '0' + newSeconds : newSeconds
  minutes.innerText = newMinutes < 10 ? '0' + newMinutes : newMinutes
}

///////////////////////////////////////////////////////////// REQUEST ROLL THE DICE
const rollDiceBtn = document.getElementById('rollDiceBtn')
rollDiceBtn.addEventListener('click', e => {
  socket.send(JSON.stringify({ type: messageTypes.THROW_DICE }))
  document.getElementById('rollDiceBtn').disabled = true
  const diceImg = document.getElementById('diceImg').children[0]
  diceImg.classList.toggle('diceImg-active')
})

function endGame({ winner }) {
  clearInterval(gameTimer)
  document.getElementById('rollDiceBtn').disabled = true
  const pin = [...document.getElementsByClassName('pin')].filter(
    el => el.innerText === winner
  )[0]
  document.getElementById('returnToHome').style.display = 'inline-block'
  // Change the turn announcement area
  document.getElementById('turnContainer').children[0].innerText = 'Game ended!'
  movePin(pin, 100)
}
