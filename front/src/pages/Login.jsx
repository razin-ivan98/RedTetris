import React, { useState, useContext, useEffect } from 'react'

import { AppContext } from '../App'

import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Text } from '../components/common/Text'
import { Flex } from '../components/common/Flex'


export const LoginPage = () => {
    const [username, changeUsername] = useState('')

    const { store } = useContext(AppContext)

    const handleLogin = () => {
        if (!store) {
            return
        }

        store.login({ username })
    }

    return <React.Fragment>
        <Flex direction="column">
            <Text>Enter your name</Text>
            <Input placeholder="Nagibator_9000" value={username} onChange={changeUsername} />
            <Button onClick={handleLogin}>LOGIN</Button>
        </Flex>
    </React.Fragment>
}
