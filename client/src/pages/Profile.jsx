import React, { useRef, useState, useEffect } from 'react'
import {useSelector} from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
function Profile() {

  const fileRef = useRef(null);

  const {currentUser} = useSelector((state) => state.user)

  const [file , setFile] = useState(undefined);

  const [formData , setFormData] = useState({}); 
  console.log(formData)

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

  return (
    <div className='p-3 max-w-lg m-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input onChange={ (e)=>setFile(e.target.files[0])} type="file" ref={fileRef} accept='image/*' hidden/>
        <img 
        onClick={() =>{fileRef.current.click()}}
        src={formData.avatar || currentUser.avatar} alt='profile' 
        className='rounded-full w-24 object-cover cursor-pointer self-center mt-2'/>
        {fileUploadError ? <p className='text-red-700 text-sm text-center'>Image Uploading failed...</p>: <div></div>  }
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

// firebase storage =\
      // allow read;
      // allow write: if
      // request.resource.size < 2 * 1024 * 1024 &&
      // request.resource.contentType.matches('image/.*');