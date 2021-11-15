import React, { useEffect, useState, Fragment } from 'react'
import { observer } from 'mobx-react'
import { Game } from '../components/Game/Game'
import { Flex } from '../components/common/Flex'
import { Text } from '../components/common/Text'
import { Button } from '../components/common/Button'

import './Room.css'
import { Checkbox } from '../components/common/Checkbox'

export const RoomPage = observer(props => {
    const {
        store,
    } = props

    const [withPenalty, changeWithPenalty] = useState(false)

    const mainGamedata = store.gamedata ? store.gamedata[store.id] : void 0

    const otherGamedata = store.gamedata ? Object.entries(store.gamedata).map(([id, game]) => {
        if (id === store.id) {
            return null
        }

        return <Flex key={`game-${id}`} direction='column'>
            <Flex direction='row' alignItems='center'>
                <Text className='otherTitle' ellipsis>{ game.username }</Text>
                <Text className='score otherTitle'> { game.score }</Text>
            </Flex>
            <Game gamedata={ game.gamedata } losed={game.losed} wined={game.wined} />
        </Flex>
    }).filter(Boolean) : []

    const handleStartGame = () => {
        store.startGame({ infMode: false, withPenalty })
    }

    const handleStartGameInfMode = () => {
        store.startGame({ infMode: true, withPenalty })
    }

    const handleChangePenalty = () => {
        changeWithPenalty(!withPenalty)
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
        <Flex direction='column'>
            <Flex direction='row' alignItems='center'>
                <Button onClick={handleExit}>Exit</Button>
                <Text>{ roomOwner }'s room</Text>
            </Flex>
            <Flex direction='row'>
                { otherGamedata.length ? <Flex direction='column' className='otherGame' justify='start'>
                    { otherGamedata }
                </Flex> : null }
                <Flex direction='column' className='mainGame'>
                    <Flex direction='row' alignItems='center'>
                        <Text ellipsis>{ mainGamedata && mainGamedata.username }</Text>
                        <Text className='score'> { mainGamedata && mainGamedata.score }</Text>
                    </Flex>
                    <Game
                        gamedata={ mainGamedata && mainGamedata.gamedata }
                        losed={losed}
                        wined={wined}
                    />

                    { isMy && !isActive && <Fragment>
                        { !isSoloGame && <Fragment>
                            <Flex direction='row' alignItems='center' justify='start'>
                                <Checkbox onClick={ handleChangePenalty } checked={ withPenalty } />
                                <Text>With penalty rows</Text>
                            </Flex>
                            <Button onClick={ handleStartGame }>Start</Button>
                        </Fragment>}
                        <Button onClick={ handleStartGameInfMode }>Start Inf Mode</Button>
                    </Fragment> }

                </Flex>
            </Flex>
        </Flex>
    </div>
})
