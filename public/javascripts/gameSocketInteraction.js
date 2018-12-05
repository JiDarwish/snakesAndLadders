const socket = new WebSocket('ws://localhost:3000')

socket.onopen = function(e) {
  console.log(e)

  socket.send(
    JSON.stringify({
      type: 'addPlayer',
      message: 'Hi'
    })
  )
}
