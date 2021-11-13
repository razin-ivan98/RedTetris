import React from 'react'
import { Flex } from '../common/Flex'
import './style.css'

export const Room = (props) => {
    const {
        players = [],
        isFull,
        isStarted,
        onClick,
    } = props

    const classNames = ['room']

    if (isFull || isStarted) {
        classNames.push('unavailable')
    }

    return <div className={classNames.join(' ')} onClick={onClick}>
        <Flex direction="column" alignItems="start">
            {Object.values(players).map((player) => <div key={player.id}>{player.username}</div>)}
            {isFull && <div class="warning">This room is already full</div>}
            {isStarted && <div class="warning">this room is already playing</div>}
        </Flex>
    </div>
}
