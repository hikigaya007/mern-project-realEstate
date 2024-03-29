import React, { useRef, useState, useEffect } from 'react'
import {useSelector , useDispatch} from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import {Link} from 'react-router-dom'

import { updateUserStart , updateUserSuccess , updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, logoutUserStart, logoutUserFailure, logoutUserSuccess } from '../redux/user/userSlice';

function Profile() {

  const fileRef = useRef(null);

  const {currentUser , loading} = useSelector((state) => state.user);

  const [file , setFile] = useState(undefined);

  const [formData , setFormData] = useState({}); 


  const [userDeleteError , setUserDeleteError] = useState(false);

  const [listingError , setListingError] = useState(false);

  const [userListing , setUserListing] = useState([])


  const dispatch = useDispatch();
  

  

  const [fileUploadError , setFileUploadError] = useState(false);


  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = (file) =>{

    const storage = getStorage(app);

    const fileName = new Date().getTime() + file.name;
    
    const storageRef = ref(storage , fileName);

    const uploadTask = uploadBytesResumable(storageRef , file);


    uploadTask.on('state_changed',null /* if you need progress details  */,
    (error)=>{
      console.log(error)
      setFileUploadError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then(
        (downloadURL) => {  
          setFormData({...formData , avatar: downloadURL})
          setFileUploadError(false);

        }
      )
    })

  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      console.log("checking the user id",currentUser._id)
      console.log(formData)

      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log(JSON.stringify(formData))

      const data = await res.json();

      console.log("this is the data test",data)

      if(data.success ===false){
        dispatch(updateUserFailure(data.message))
        return;
      }

      dispatch(updateUserSuccess(data));

    } catch (error) {
      dispatch(updateUserFailure((error.message)))
    }
  }

  const handleDelete = async () =>{


    try {
      dispatch(deleteUserStart());

      const res = await fetch(`api/user/delete/${currentUser._id}`,{
        method :'DELETE'
      });

      const data = await res.json();

      console.log("checking delete" , data)

      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        setUserDeleteError(true);
        return ; 
      }

      dispatch(deleteUserSuccess(data));
      setUserDeleteError(false)

    } catch (error) {
        dispatch(deleteUserFailure(error.message));
        setUserDeleteError(true);

      
    }
  }

  const handleSignout = async () => {
    try {
      dispatch(logoutUserStart());
      const res = await fetch('/api/auth/signout')
      const data = await res.json();

      if(data.success === false){
        dispatch(logoutUserFailure(data.message))
        return ;
      }
      dispatch(logoutUserSuccess());
    } catch (error) {
      dispatch(logoutUserFailure(error));
    }
  } 

  const handleChange = (e)=>{
    setFormData({...formData , [e.target.id] : e.target.value})
  }

  const handleShowListing = async() => {
    try {
      setListingError(false);
      const res = await fetch(`api/user/listings/${currentUser._id}`);
      const data = await res.json();

      console.log(data)

      if(data.success === false){
        setListingError(true);
        return;
      }
      setUserListing(data);

    } catch (error) {
      setListingError(true);
    }
  }

  const handleDeleteListing = async(id) => {

    try {
      
      const res = await fetch(`/api/listing/delete/${id}` , {
        method: 'DELETE',
      });

      const data = res.json();

      if(data.success === false){
        console.log(data.message)
        return ;
      }

      setUserListing((prev) => prev.filter((listing) => listing._id !== id))

    } catch (error) {
      console.log(error.message)
    }

  }



  return (
    <div className='p-3 max-w-lg m-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={ (e)=>setFile(e.target.files[0])} type="file" ref={fileRef} accept='image/*' hidden/>
        <img 
        onClick={() =>{fileRef.current.click()}}
        src={formData.avatar || currentUser.avatar} alt='profile' 
        className='rounded-full w-24 object-cover cursor-pointer self-center mt-2'/>
        {fileUploadError ? <p className='text-red-700 text-sm text-center'>Image Uploading failed...</p>: <div></div>  }
        <input 
        defaultValue={currentUser.username}
        onChange={handleChange}
        type="text" placeholder='Username' 
        className='border p-3 rounded-lg' id='username'/>
        <input 
        defaultValue={currentUser.email}
        onChange={handleChange}
        type="email" placeholder='Email' 
        className='border p-3 rounded-lg' id='email'/>
        <input 
        defaultValue={currentUser.passord}
        onChange={handleChange}
        type="text" placeholder='Password' 
        className='border p-3 rounded-lg' id='password'/>
        <button className='bg-slate-700 text-white uppercase p-3 hover:opacity-95 rounded-lg'>{loading ?'Loading...':'Update'}</button>
        <Link className='bg-green-700 text-white rounded-lg p-3 text-center uppercase hover:opacity-70' to={'/add-property'}>
          Add Property
        </Link>

      </form>
      <div className='flex justify-between mt-5'>
        <span 
        onClick={handleDelete}
        className='text-red-700 cursor-pointer '>Delete account</span>
        <span 
        onClick={handleSignout}
        className='text-red-700 cursor-pointer '>Sign Out</span>
      </div>
      {userDeleteError ? <p className='text-center text-red-700 text-sm pt-4'>Something happened could not delete the account</p>:  <div></div>  }
      <button className='text-green-700 w-full'
      onClick={handleShowListing}
      >Show Added Property 🔽</button>
      <p className='text-red-700 mt-5'>{listingError ? "Error Showing Listing" : ""}</p>

    {userListing && userListing.length > 0 &&
    userListing.map((listing) => {
      return(
        <div className='flex border rounded-lg  gap-4 p-3 justify-between items-center'  key={listing._id}>
          <Link to={`/listing/${listing._id}`}>
            <img 
            className='h-16 w-16 object-contain rounded-lg'
            src={listing.imageURLs[0]} alt="listing cover" />
          </Link>
          <Link 
          className='text-slate-700 font-semibold  flex-1 hover:underline truncate' to={`/listing/${listing._id}`}>
            <p >{listing.name}</p>
          </Link>
          <div className='flex flex-col items-center'>
            <button className='text-green-700 uppercase'>
              <Link to={`/update-listing/${listing._id}`}>
                Edit
              </Link>
            </button>
            <button 
            onClick={() => handleDeleteListing(listing._id)}
            className='text-red-700 uppercase'>Delete</button>
          </div>
        </div>
      )
    })
    }

    </div>
  )
}

export default Profile;

