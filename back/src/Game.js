const { WIDTH, HEIGHT } = require('../config')
const defaultGameData = require('./defaultGameData')
const Figure = require('./Figure')
const { generateGamedataRow, generateGamedata } = require('./generators')

class Game {
    constructor() {
        this.gamedata = generateGamedata()
        this.currentFigure = null
        this.renderGamedata = generateGamedata()
        this.isActive = false
    }

    start (penaltyCb) {
        this.isActive = true
        this.penaltyCb = penaltyCb
    }

    stop () {
        this.isActive = false
        this.penaltyCb = null
    }

    spawnFigure() {
        if (this.currentFigure) {
            return
        }
        this.currentFigure = new Figure()
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
            this.render()
            return
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
                    this.gamedata.unshift(generateGamedataRow())
                    count++
                }
            }
        }
        count && this.penaltyCb && this.penaltyCb(count)
    }

    isPlaceAvailable(x, y) {
        const figure = this.currentFigure.figure
        const width = figure[0].length
        const height = figure.length

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const gameI = x + i
                const gameJ = y + j

                if (
                    figure[j][i] !== 0
                    && (gameI < 0 || gameI > WIDTH - 1 || gameJ < 0 || gameJ > HEIGHT - 1)
                ) {
                    return false
                }

                if (figure[j][i] !== 0 && this.gamedata[gameJ][gameI] !== 0) {
                    return false
                }
                
            }
        }
        return true
    }

    getPenalty(count) {
        if (!this.isActive) {
            return
        }
        for (let i = 0; i < count; i++) {
            this.gamedata.shift()
            this.gamedata.push(generateGamedataRow())
        }
        this.render()
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

    render () {
        if (!this.currentFigure) {
            return
        }

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
