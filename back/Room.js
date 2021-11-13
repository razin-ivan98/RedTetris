const Game = require('./Game')

class Room {
    constructor (id, ownername) {
        this.id = id
        this.players = {
            [id]: {
                id,
                username: ownername,
                score: 0,
                game: new Game()
            }
        },
        this.playersCount = 1
        this.isFull = false
        this.isActive = false
        this.interval = null
        this.tickCb = null
    }

    start(cb) {
        if (this.isActive) {
            return
        }
        this.isActive = true
        // console.log("GAME STARTED");
        for (let player of Object.values(this.players)) {
            // console.log("PLAYERS", Object.values(this.players));

            // console.log("PLAYER", player);
            if (player.game)
                player.game.start()
        }
        this.tickCb = cb
        this.interval = setInterval(() => this.tick(), 100) //в константу
    }

    stop() {
        clearInterval(this.interval)
    }

    tick() {
        // console.log("tick", this.isStarted);
        if (!this.isActive) {
            return
        }
        // console.log("tickTack");
        if (Object.values(this.players).reduce((prev, curr) => prev && !curr.game.isActive, true)) {
            this.stop()
        }

        for (let player of Object.values(this.players)) {
            // console.log("ЩА БУИТ ГЕЙМ ТИК", player);

            if (player.game) {
                // console.log("ЩА БУИТ ГЕЙМ ТИК", player);
                player.game.tick()
            }
                
        }
        this.tickCb()
    }

    join(id, username) {
        if (this.isFull) { //
            return false
        }
        if (this.isActive) {
            return false
        }
        this.players[id] = {
            id,
            username: username,
            score: 0,
            game: new Game()
        }
        this.playersCount++

        return true
    }

    left(playerId) {
        this.players[playerId].game.left()
    }
    right(playerId) {
        this.players[playerId].game.right()
    }
    rotate(playerId) {
        this.players[playerId].game.rotate()
    }
    drop(playerId) {
        this.players[playerId].game.drop()
    }

    leave(playerId) {
        if (this.players[playerId]) {
            delete this.players[playerId]
            this.playersCount--
        }
    }

    get gamedata() {
        const data = {}

        for (let player of Object.values(this.players)) {
            if (player.game) {
                data[player.id] = player.game.renderGamedata
            }
        }

        return data
    }
}

module.exports = Room
