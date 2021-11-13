class Room {
    constructor (id, ownername) {
        this.id = id
        this.players = {
            [id]: ownername
        },
        this.playersCount = 1
        this.isFull = false
        this.isStarted = false
    }

    join(id, username) {
        if (this.isFull) { //
            return false
        }
        if (this.isStarted) {
            return false
        }
        this.players[id] = username
        this.playersCount++

        return true
    }

    leave(playerId) {
        if (this.players[playerId]) {
            delete this.players[playerId]
            this.playersCount--
        }
    }
}

module.exports = Room
