const messageTypes = {
  ADD_PLAYER: 'ADD_PLAYER',
  THROW_DICE: 'THROW_DICE',
  MOVE_PIN: 'MOVE_PIN',
  START_GAME: 'START_GAME',
  PLAYER_NAMES: 'PLAYER_NAMES',
  PLAYER_LEFT: 'PLAYER_LEFT',
  TURN_CHANGE: 'TURN_CHANGE',
  BROADCAST_TURN: 'BROADCAST_TURN',
  END_GAME: 'END_GAME'
}

if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
  module.exports = messageTypes
}
