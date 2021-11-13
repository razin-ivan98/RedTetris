import {
  login,
  createRoom,
  joinRoom,
  getRooms,
  startGame,
  gameAction,
} from './apiRequests'

import SocketIOClient from 'socket.io-client';

import { bindArgs } from '../../helpers'

const URL = 'ws://localhost:9000'

export const initApi = (reducers) => {
  const io = SocketIOClient(URL)

  io.on('connect', () => {
    console.log('подключился')
  })

  io.on('login', ({ username, id }) => {
    console.log('зарегистрирован как ' + username + ', id: ' + id)
    reducers.setUsername(id, username)
  })

  io.on('getRooms', ({ rooms }) => {
    console.log('получены комнаты')
    reducers.setRooms(rooms)
  })

  io.on('join', ({ roomId }) => {
    console.log('присоединились к комноте')
    reducers.setCurrentRoom(roomId)
  })

  io.on('gamedata', ({ gamedata }) => {
    console.log('новое состояние')
    reducers.setGamedata(gamedata)
  })

  return {
    joinRoom: bindArgs(joinRoom, io),
    login: bindArgs(login, io),
    createRoom: bindArgs(createRoom, io),
    getRooms: bindArgs(getRooms, io),
    startGame: bindArgs(startGame, io),
    gameAction: bindArgs(gameAction, io),
  }
}
