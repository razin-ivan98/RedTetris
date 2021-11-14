import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { Game } from '../components/Game/Game'
import { Flex } from '../components/common/Flex'
import { Text } from '../components/common/Text'
import { Button } from '../components/common/Button'

import './Room.css'

export const RoomPage = observer(props => {

    const {
        store,
    } = props

    const mainGamedata = store.gamedata ? store.gamedata[store.id] : void 0

    const otherGamedata = store.gamedata ? Object.entries(store.gamedata).map(([id, game]) => {
        if (id === store.id) {
            return null
        }

        return <Flex key={`game-${id}`} direction='column'>
            <Text className='otherTitle' ellipsis>{ game.username }</Text>
            <Game gamedata={ game.gamedata } losed={game.losed} wined={game.wined} />
        </Flex>
    }).filter(Boolean) : []

    const handleStartGame = () => {
        store.startGame({ infMode: false })
    }
    const handleStartGameInfMode = () => {
        store.startGame({ infMode: true })
    }

    useEffect(() => {
        const handleKeyDown = e => {
            if (
                !store.gamedata
                || !store.gamedata[store.id]
                || store.gamedata[store.id].losed
                || store.gamedata[store.id].wined
                || !store.gamedata[store.id].isActive
            ) {
                return
            }

            switch (e.code) {
                case 'ArrowLeft':
                    store.gameAction({ type: 'left' })
                    break;
                case 'ArrowRight':
                    store.gameAction({ type: 'right' })
                    break;
                case 'ArrowUp':
                    store.gameAction({ type: 'rotate' })
                    break;
                case 'ArrowDown':
                    store.gameAction({ type: 'speed' })
                    break;
                case 'Space':
                    store.gameAction({ type: 'drop' })
                    break;
            
                default:
                    break;
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        };
    }, [store]);

    const isMy = store.currentRoom === store.id
    const isActive = mainGamedata && mainGamedata.isActive
    const isSoloGame = store.gamedata && Object.values(store.gamedata).length === 1
    const wined = mainGamedata && mainGamedata.wined
    const losed = mainGamedata && mainGamedata.losed

    const roomOwner = (store.gamedata
        && store.gamedata[store.currentRoom]
        && store.gamedata[store.currentRoom].username)
        || 'UNKNOWN'

    const handleExit = () => {
        store.leaveRoom()
    }

    return <div>
        <Flex direction="column">
            <Flex direction="row" alignItems="center">
                <Button onClick={handleExit}>Exit</Button>
                <Text>{ roomOwner }'s room</Text>
            </Flex>
            <Flex direction="row">
                { otherGamedata.length ? <Flex direction="column" className="otherGame"  justify="start">
                    { otherGamedata }
                </Flex> : null }
                <Flex direction="column" className="mainGame">
                    <Text ellipsis>{ mainGamedata && mainGamedata.username }</Text>
                    <Game
                        gamedata={ mainGamedata && mainGamedata.gamedata }
                        losed={losed}
                        wined={wined}
                    />
                    { isMy && !isActive && !isSoloGame && <Button onClick={ handleStartGame }>Start</Button> }
                    { isMy && !isActive && <Button onClick={ handleStartGameInfMode }>Start Inf Mode</Button> }
                </Flex>
            </Flex>
        </Flex>
    </div>
})
