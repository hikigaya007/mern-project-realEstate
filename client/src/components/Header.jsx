import React from 'react'
import {FaSearch} from 'react-icons/fa'
import {NavLink,Link} from 'react-router-dom'
import {useSelector} from 'react-redux'


function Header() {

    const {currentUser} = useSelector(state => state.user);
  return (
    <header className='bg-slate-200 shadow-md'>
        
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <NavLink to='/'>
        <h1 className='font-bold text-sm sm:test-xl flex flex-wrap '>
            <span className='text-slate-500'>Real</span>
            <span className='text-slate-700'>Estate</span>
        </h1>
        </NavLink>
    <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
        <input type="text" placeholder='Search...' className='bg-transparent outline-none w-24 sm:w-64'/>
        <FaSearch className='text-slate-600 cursor-pointer'/>
    </form>
    <ul className='flex gap-4 '>
        <NavLink to='/'><li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>Home</li></NavLink>
        <NavLink to='/about'><li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer' >About</li></NavLink>
        {currentUser ? 
        <Link to='/profile'>
        <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="profile" /> </Link> :  <NavLink to='/signup'><li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer '>Sign Up</li></NavLink>}

    </ul>
        </div>
        
    </header>
  )
}

export default Header