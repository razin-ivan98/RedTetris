import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { Game } from '../components/Game/Game'
import { Flex } from '../components/common/Flex'
import { Button } from '../components/common/Button'

import './Room.css'

export const RoomPage = observer((props) => {

    const {
        store,
    } = props

    const mainGamedata = store.gamedata ? store.gamedata[store.id] : void 0

    const otherGamedata = store.gamedata ? Object.entries(store.gamedata).map(([id, game]) => {
        if (id === store.id) {
            return null
        }
        return <Game key={`game-${id}`} gamedata={game} />
    }) : []

    const handleStartGame = () => {
        store.startGame()
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
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

    return <div>
        <Flex direction="row">
            <Flex direction="column" className="otherGame">
                {otherGamedata}
            </Flex>
            <Flex direction="column" className="mainGame">
                <Game gamedata={mainGamedata} />
                {isMy && <Button onClick={handleStartGame}>Start game</Button>}
            </Flex>
        </Flex>
    </div>
})
