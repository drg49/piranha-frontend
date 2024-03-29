import { useState, createContext, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import Header from './components/Header'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import MyProfile from './pages/MyProfile'
import UserProfile from './pages/UserProfile'
import './App.css';
import AllPosts from './pages/AllPosts'
import CreatePost from './pages/CreatePost'
import logo from './components/Logo.png'
import FollowersPosts from './pages/FollowerPosts'
import Followers from './pages/Followers'
import SearchPage from './pages/SearchPage'

export const GlobalCtx = createContext(null)

function App() {

  const [gState, setGState] = useState({
    url: "https://piranha-app.onrender.com", /*"http://localhost:4000",*/
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
        <div id="app-title"><h1 id="app-name">Piranha</h1><img src={logo} id="logo" alt="Piranha logo"/></div>
        <Header />
        <main>
          <Switch>
            <Route exact path="/" render={(rp => gState.token ? <AllPosts /> : <Home />)}/>
            <Route path="/home" render={(rp => gState.token ? <FollowersPosts /> : <Home />)}/>
            <Route path="/signup" render={(rp) => <Signup {...rp}/>} />
            <Route path="/login" render={(rp) => <Login {...rp}/>}/>
            <Route path="/my_profile" render={(rp => gState.token ? <MyProfile /> : <Home />)}/>
            <Route path="/user/:user" render={(rp => gState.token ? <UserProfile {...rp}/> : <Home />)}/>
            <Route path="/create_post" render={(rp => gState.token ? <CreatePost {...rp}/> : <Home />)}/>
            <Route path="/followers/:name/:data/:num" render={(rp => gState.token ? <Followers {...rp}/> : <Home />)}/>
            <Route path="/search" render={(rp => gState.token ? <SearchPage /> : <Home />)}/>
          </Switch>
        </main>
      </div>
    </GlobalCtx.Provider>
  );
}

export default App;
