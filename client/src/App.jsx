import React from 'react'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateProperty from './pages/CreateProperty'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'


export default function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route exact path='/' element = {<Home/>}></Route>
        <Route exact path='/about' element = {<About/>}></Route>
        <Route exact path='/listing/:listingId' element = {<Listing/>}></Route>
        <Route exact path='/search' element = {<Search/>}></Route>
        <Route element={<PrivateRoute/>}>
          <Route exact path='/profile' element = {<Profile/>}></Route> 
          <Route exact path='/add-property' element = {<CreateProperty/>}></Route> 
          <Route exact path='/update-listing/:listingId' element = {<UpdateListing/>}></Route> 
        </Route>
        <Route exact path='/signin' element = {<SignIn/>}></Route>
        <Route exact path='/signup' element = {<SignUp/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}
