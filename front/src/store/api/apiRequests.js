export const login = (io, data) => {
    io.emit('login', data )
}

export const createRoom = (io) => {
    io.emit('createRoom')
}

export const joinRoom = (io, data) => {
    io.emit('joinRoom', data)
}

export const getRooms = (io) => {
    io.emit('getRooms')
}

export const startGame = (io) => {
    io.emit('startGame')
}

export const gameAction = (io, data) => {
    io.emit('gameAction', data)
}
