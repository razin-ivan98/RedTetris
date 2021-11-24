import { observable } from 'mobx'
import { bindArgs } from '../helpers'
import { initApi } from './api/api'
import SocketIOClient from 'socket.io-client';

const URL = 'ws://localhost:9000'

export const initStore = () => {

    const store = observable({})

    store.username = null
    store.id = null
    store.gamedata = null
    store.currentFigure = null
    store.rooms = null
    store.currentRoom = null

    const setGamedata = bindArgs((store, gamedata) => {
        store.gamedata = gamedata
    }, store)

    const setCurrentFigure = bindArgs((store, currentFigure) => {
        store.currentFigure = currentFigure
    }, store)

    const setUsername = bindArgs((store, id, username) => {
        store.id = id
        store.username = username
    }, store)

    const setRooms = bindArgs((store, rooms) => {
        store.rooms = rooms
    }, store)

    const setCurrentRoom = bindArgs((store, currentRoom) => {
        store.currentRoom = currentRoom
    }, store)

    const reducers = {
        setGamedata,
        setUsername,
        setCurrentFigure,
        setRooms,
        setCurrentRoom
    }
    const io = SocketIOClient(URL)

    const api = initApi(io, reducers)

    Object.assign(store, api)

    return store
}
