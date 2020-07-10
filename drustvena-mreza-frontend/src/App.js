import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './components/Login/Login.jsx'
import Register from './components/Register/Register.jsx'
import NavbarRoute from './components/NavbarRoute/NavbarRoute.jsx'
import './app.css'
import { MuiThemeProvider } from '@material-ui/core/styles'
import appTheme from './appTheme'
import { Provider } from 'react-redux'
import { store, persistor } from './state/store'
import { PersistGate } from 'redux-persist/integration/react'


function App() {
  return (

    <Router>
      <div className="App">
        <MuiThemeProvider theme={appTheme}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Switch>
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/" component={NavbarRoute} />
              </Switch>
            </PersistGate>
          </Provider>
        </MuiThemeProvider>
      </div>
    </Router>
  );
}

export default App;
