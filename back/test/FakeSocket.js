class FakeSocket {
    constructor (id, rooms) {
        this.id = id || 'defaultId'
        this.rooms = rooms || {}
        this.events = []
        this.listeners = {}
    }

    join(room) {
        this.rooms[room] = room
    }

    leave(room) {
        delete this.rooms[room]
    }

    emit(event, message) {
        this.events.push({ event, message })
    }

    on(event, cb) {
        this.listeners[event] = cb
    }
}

module.exports = FakeSocket
