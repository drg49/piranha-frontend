import { useState, createContext, useEffect } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import Header from './components/Header'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import './App.css';
import AllPosts from './pages/AllPosts'



export const GlobalCtx = createContext(null)

function App() {

  const [gState, setGState] = useState({
    url: "http://localhost:4000", 
    token: null
  })

    //SEEING IF ALREADY LOGGED IN
    useEffect(() => {
      const token = JSON.parse(localStorage.getItem("token"))
      if (token) {
        setGState({...gState, token: token.token})
      }
    }, [])

  return (
    <GlobalCtx.Provider value = {{gState, setGState}}>
      <div className="App">
        <Link to="/"><h1>Postland</h1></Link>
        <Header />
        <main>
          <Switch>
            <Route exact path="/" render={(rp => gState.token ? <AllPosts /> : <Home />)}/>
            <Route path="/signup" render={(rp) => <Signup {...rp}/>} />
            <Route path="/login" render={(rp) => <Login {...rp}/>}/>
            <Route path="/my_profile" render={(rp => gState.token ? <Dashboard /> : <Home />)}/>
          </Switch>
        </main>
      </div>
    </GlobalCtx.Provider>
  );
}

export default App;
