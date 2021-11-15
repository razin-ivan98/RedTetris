const Room = require('./Room')

class Player {
    constructor(id, username) {
        this.id = id
        this.username = username
        this.room = null
    }

    createRoom() {
        if (this.room) { //он уже в какой то комноте
            return
        }

        this.room = new Room(this.id, this.username)

        return this.room
    }

    joinRoom(room) {
        if (this.room) { //уже есть комната
            return
        }

        const res = room.join(this.id, this.username)

        if (!res) {
            return false
        }

        this.room = room
        return true
    }

    leaveRoom() {
        if (!this.room) { // не состоит в комнате
            return
        }
        this.room.leave(this.id)
        this.room = null
    }
}

module.exports = Player
