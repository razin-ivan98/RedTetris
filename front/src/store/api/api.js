import {
  login,
  createRoom,
  joinRoom,
  getRooms,
  startGame,
  gameAction,
  leaveRoom,
} from './apiRequests'

import SocketIOClient from 'socket.io-client';

import { bindArgs } from '../../helpers'

const URL = 'ws://localhost:9000'

export const initApi = (reducers) => {
  const io = SocketIOClient(URL)

  io.on('connect', () => {
  })

  io.on('login', ({ username, id }) => {
    reducers.setUsername(id, username)
  })

  io.on('getRooms', ({ rooms }) => {
    reducers.setRooms(rooms)
  })

  io.on('join', ({ roomId }) => {
    reducers.setCurrentRoom(roomId)
  })

  io.on('gamedata', ({ gamedata }) => {
    reducers.setGamedata(gamedata)
  })

  return {
    joinRoom: bindArgs(joinRoom, io),
    login: bindArgs(login, io),
    createRoom: bindArgs(createRoom, io),
    getRooms: bindArgs(getRooms, io),
    startGame: bindArgs(startGame, io),
    gameAction: bindArgs(gameAction, io),
    leaveRoom: bindArgs(leaveRoom, io),
  }
}
