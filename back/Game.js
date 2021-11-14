const defaultGameData = require('./defaultGameData')
const Figure = require('./Figure')

class Game {
    constructor() {
        this.gamedata = []

        for (let j = 0; j < 20; j++) { //optimize в функцию-генератор
            this.gamedata.push([])
            for (let i = 0; i < 10; i++) {
                this.gamedata[j].push(0)
            }
        }
        this.currentFigure = null
        this.renderGamedata = []
        for (let j = 0; j < 20; j++) { //optimize в функцию-генератор
            this.renderGamedata.push([])
            for (let i = 0; i < 10; i++) {
                this.renderGamedata[j].push(0)
            }
        }
        this.isActive = false
    }

    start () {
        this.isActive = true
    }

    stop () {
        this.isActive = false
    }

    spawnFigure() {
        if (this.currentFigure) {
            return
        }
        this.currentFigure = new Figure()
        this.isSpeeded = false
    }

    tick() {
        if (!this.isActive) {
            return
        }

        if (!this.currentFigure) {
            this.currentFigure = new Figure()
            if (!this.isPlaceAvailable(this.currentFigure.x, this.currentFigure.y)) {
                this.stop()
            }
        }

        if (!this.currentFigure.isActive) {
            this.fixFigure()
            this.currentFigure = null
            return //// поменять
        }

        const nextX = this.currentFigure.x
        let nextY = this.currentFigure.y + 1 // стандартное падение

        const canMove = this.isPlaceAvailable(nextX, nextY)

        if (canMove) {
            this.currentFigure.x = nextX
            this.currentFigure.y = nextY
        } else {
            this.currentFigure.isActive = false
        }

        this.render()
    }

    fixFigure() {
        const figure = this.currentFigure.figure
        const width = figure[0].length
        const height = figure.length
        const figureX = this.currentFigure.x
        const figureY = this.currentFigure.y

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const gameI = figureX + i
                const gameJ = figureY + j

                if (figure[j][i] !== 0) {
                    this.gamedata[gameJ][gameI] = figure[j][i]
                }
            }
        }
        this.checkRows()
    }

    checkRows() {
        let count = 0
        let ready = false
        while (!ready) {
            ready = true
            for (let i = 0; i < 20; i++) {
                let isFilled = true
                for (let j = 0; j < 10; j++) {
                    if (this.gamedata[i][j] === 0) {
                        isFilled = false
                        break
                    }
                }
                if (isFilled) {
                    ready = false
                    this.gamedata.splice(i, 1)
                    this.gamedata.unshift([0,0,0,0,0,0,0,0,0,0]) // в константу
                    count++
                }
            }
        }
        // пенальти
    }

    isPlaceAvailable (x, y) {
        const figure = this.currentFigure.figure
        const width = figure[0].length
        const height = figure.length

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const gameI = x + i
                const gameJ = y + j

                if (figure[j][i] !== 0 && (gameI < 0 || gameI > 9 || gameJ < 0 || gameJ > 19)) { // в константы
                    return false
                }
                if (figure[j][i] !== 0 && this.gamedata[gameJ][gameI] !== 0) {
                    return false
                }
                
            }
        }
        return true
    }

    drop() {
        if (!this.currentFigure || !this.currentFigure.isActive) {
            return
        }
        const figure = this.currentFigure
        let nextY = figure.y
        const nextX = figure.x
        while (this.isPlaceAvailable(nextX, nextY)) {
            this.currentFigure.x = nextX
            this.currentFigure.y = nextY
            nextY++
        }
        figure.isActive = false
        this.render()
    }

    rotate() {
        if (!this.currentFigure || !this.currentFigure.isActive) {
            return
        }
        const figure = this.currentFigure
        figure.rotateLeft()
        if (!this.isPlaceAvailable(figure.x, figure.y)) {
            figure.rotateRight()
        }
        this.render()
    }

    left() {/// унифицировать
        if (!this.currentFigure || !this.currentFigure.isActive) {
            return
        }
        const nextX = this.currentFigure.x - 1
        const nextY = this.currentFigure.y
        const canMove = this.isPlaceAvailable(nextX, nextY)

        if (canMove) {
            this.currentFigure.x = nextX
        }
        this.render()
    }
    right() {
        if (!this.currentFigure || !this.currentFigure.isActive) {
            return
        }
        const nextX = this.currentFigure.x + 1
        const nextY = this.currentFigure.y
        const canMove = this.isPlaceAvailable(nextX, nextY)

        if (canMove) {
            this.currentFigure.x = nextX
        }
        this.render()
    }
    speed() {
        this.isSpeeded = true
    }

    render () {
        const gamedataFrame = []
        const figureX = this.currentFigure.x
        const figureY = this.currentFigure.y
        const figure = this.currentFigure.figure

        for (let j = 0; j < 20; j++) {
            gamedataFrame.push([])
            for (let i = 0; i < 10; i++) {
                let cell = this.gamedata[j][i]
                if (figure[j - figureY] && figure[j - figureY][i - figureX]) {
                    cell = figure[j - figureY][i - figureX]
                }

                gamedataFrame[j].push(cell)
            }
        }

        this.renderGamedata = gamedataFrame
    }
}

module.exports = Game
