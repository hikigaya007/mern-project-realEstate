import React from 'react'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignOut from './pages/SignOut'
import About from './pages/About'
import Profile from './pages/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element = {<Home/>}></Route>
        <Route exact path='/about' element = {<About/>}></Route>
        <Route exact path='/profile' element = {<Profile/>}></Route>
        <Route exact path='/signin' element = {<SignIn/>}></Route>
        <Route exact path='/signout' element = {<SignOut/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}
