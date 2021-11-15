const figureTemplates = require('./figureTemplates')

class Figure { // Фига
    constructor() {
        this.figureTemplates = figureTemplates
        this.x = 3
        this.y = 0 //начальное положенее
        this.currentShapeKey = 0
        this.currentFigureKey = 0
        this.isActive = true

        this.generateRandomFigure()
    }

    rotateRight() {
        this.currentShapeKey =
            this.figureTemplates[this.currentFigureKey][this.currentShapeKey - 1]
                ? this.currentShapeKey - 1
                : Object.values(this.figureTemplates[this.currentFigureKey]).length - 1
    }
    rotateLeft() {
        this.currentShapeKey =
            this.figureTemplates[this.currentFigureKey][this.currentShapeKey + 1]
                ? this.currentShapeKey + 1
                : 0
    }

    generateRandomFigure() {
        const figuresKeys = Object.keys(this.figureTemplates)
        const randomFigureKey = Math.floor(Math.random() * figuresKeys.length)
        const shapeKeys = Object.keys(this.figureTemplates[randomFigureKey])
        const randomShapeKey = Math.floor(Math.random() * (shapeKeys.length))

        this.currentFigureKey = randomFigureKey
        this.currentShapeKey = randomShapeKey
    }

    get figure() {
        return this.figureTemplates[this.currentFigureKey][this.currentShapeKey]
    }
}

module.exports = Figure