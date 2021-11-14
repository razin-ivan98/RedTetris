import React from 'react'

import './Game.css'

import { defultGamedata } from './defaultGamedata'

export const Game = props => {

    const {
        gamedata = defultGamedata,
        losed,
        wined
    } = props

    return <React.Fragment>

        <div className="container">
            { /* хак для высоты, зависимой от ширины */ }
            <div className="content" />

            <div className="grid">
                { gamedata.map((row, i) => row.map((cell, j) => {
                    const boxClassName = cell === 0 ? "box" : "filled-box"

                    return <div key={ `cell${i}*${j}` } className={ boxClassName } />
                })) }
            </div>

            { losed && <div className="verdict losed">LOSE</div>}
            { wined && <div className="verdict wined">WIN</div>}

        </div>
        
    </React.Fragment>
}
