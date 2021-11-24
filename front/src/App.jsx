import React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import { observer } from 'mobx-react'
import './App.css';

import { LoginPage } from './pages/LoginPage'
import { LobbyPage } from './pages/LobbyPage'
import { RoomPage } from './pages/RoomPage'

const App = observer(({ store }) => {
  return (
    <div className='App'>
      <HashRouter>
        <Switch>
          <Route exact path='/'>
            {store.username ? <Redirect to='/lobby' /> : <LoginPage store={store} />}
          </Route>
          <Route exact path='/lobby/'>
            {!store.username ? <Redirect to='/' />
              : store.currentRoom ? <Redirect to={`/room/${store.currentRoom}`} />
                : <LobbyPage store={store} />}
          </Route>
          <Route exact path='/room/:id'>
            {!store.username ? <Redirect to='/' />
              : store.currentRoom ? <RoomPage store={store} />
                : <Redirect to='/lobby' />}
          </Route>
          
        </Switch>
      </HashRouter>
    </div>
  )
})

export default App;
