import { createContext } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { observer } from 'mobx-react'
import './App.css';

import { LoginPage } from './pages/Login'
import { LobbyPage } from './pages/Lobby'
import { RoomPage } from './pages/Room'


export const AppContext = createContext({  });

const App = observer(({ store }) => {
  return (
    <div className="App">
      <AppContext.Provider value={{ store }}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              {store.username ? <Redirect to="/lobby" /> : <LoginPage />}
            </Route>
            <Route exact path="/lobby/">
              {!store.username ? <Redirect to="/" />
                : store.currentRoom ? <Redirect to={`/room/${store.currentRoom}`} />
                  : <LobbyPage store={store} />}
            </Route>
            <Route exact path="/room/:id">
              {!store.username ? <Redirect to="/" /> : <RoomPage store={store} />}
            </Route>
            
          </Switch>
        </BrowserRouter>
      </AppContext.Provider>
    </div>
  )
})

export default App;
