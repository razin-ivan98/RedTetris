import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { Button } from '../components/common/Button'
import { Flex } from '../components/common/Flex'
import { Text } from '../components/common/Text'
import { Room } from '../components/Room/Room'
import { bindArgs } from '../helpers'

import './Lobby.css'

export const LobbyPage = observer(({store}) => {

    useEffect(() => {
        store.getRooms()
    }, [store])

    const handleCreateRoom = () => {
        store.createRoom()
    }

    const handleJoinRoom = (id) => {
        store.joinRoom({ id })
    }

    return <div className="lobby">
        <Flex direction="column">
            <Text>Hello, { store.username }</Text>
            <Text>Choose room or create your own one</Text>
            <Flex className="roomsList" direction="column" justify="start">
                {store.rooms && store.rooms.map((room) => 
                    <Room
                        key={room.id}
                        players={Object.values(room.players)}
                        isFull={room.isFull}
                        isStarted={room.isActive}
                        onClick={room.isFull || room.isStarted ? null : bindArgs(handleJoinRoom, room.id)}
                    />
                )}
            </Flex>
            <Button onClick={handleCreateRoom}>Create room</Button>
        </Flex>
    </div>
})
