import React from 'react'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route exact path='/' element = {<Home/>}></Route>
        <Route exact path='/about' element = {<About/>}></Route>
        <Route element={<PrivateRoute/>}>
          <Route exact path='/profile' element = {<Profile/>}></Route>
        </Route>
        <Route exact path='/signin' element = {<SignIn/>}></Route>
        <Route exact path='/signup' element = {<SignUp/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}
