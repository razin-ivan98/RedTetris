import React, { useState } from 'react'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Text } from '../components/common/Text'
import { Flex } from '../components/common/Flex'


export const LoginPage = ({ store }) => {
    const [username, changeUsername] = useState('')

    const handleLogin = () => {
        if (!store || !username) {
            return
        }

        store.login({ username })
    }

    return <React.Fragment>
        <Flex direction='column'>
            <Text>Enter your name</Text>
            <Input placeholder='Nagibator_9000' value={ username } onChange={ changeUsername } />
            <Button onClick={ handleLogin }>LOGIN</Button>
        </Flex>
    </React.Fragment>
}
