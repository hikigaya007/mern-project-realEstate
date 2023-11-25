import React from 'react'
import {useSelector} from 'react-redux'

function Profile() {

  const {currentUser} = useSelector((state) => state.user)
  return (
    <div className='p-3 max-w-lg m-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img src={currentUser.avatar} alt='profile' 
        className='rounded-full w-24 object-cover cursor-pointer self-center mt-2'/>
        <input type="text" placeholder='Username' 
        className='border p-3 rounded-lg' id='username'/>
        <input type="email" placeholder='Email' 
        className='border p-3 rounded-lg' id='email'/>
        <input type="text" placeholder='Password' 
        className='border p-3 rounded-lg' id='password'/>
        <button className='bg-slate-700 text-white uppercase p-3 hover:opacity-95 rounded-lg'>Update</button>

      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer '>Delete account</span>
        <span className='text-red-700 cursor-pointer '>Sign Out</span>
      </div>
    </div>
  )
}

export default Profile