class FakeIO {
    constructor (socket) {
        this.rooms = {}
        this.socket = socket
    }

    to(roomToSend) {
        return {
            emit: (event, message) => {
                const room = this.rooms[roomToSend]
                if (!room) {
                    this.rooms[roomToSend] = {}
                }
                const messages = this.rooms[roomToSend].messages
                if (!messages) {
                    this.rooms[roomToSend].messages = []
                }

                this.rooms[roomToSend].messages.push({ event, message })
            }
        }
    }

    on(event, cb) {
        cb(this.socket)
    }
}

module.exports = FakeIO
