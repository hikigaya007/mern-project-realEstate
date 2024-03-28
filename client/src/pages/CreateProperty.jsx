import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';

function CreateProperty() {

    const [files , setFiles] = useState([]);
    const [formData , setFormData] = useState({
        imageURLs: [],
    })
    const[uploading , setUploading] = useState(false);

    const [imageUploadError , setImageUploadError ] = useState(false);
    
    
    const handleImageSubmit = () => {
        setUploading(true);
        if(files.length > 0 && files.length < 7){
            const promises = [];

            for (let i = 0 ; i< files.length ; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({...formData , imageURLs: formData.imageURLs.concat(urls)})
                setUploading(false)
                setImageUploadError(false);
            }).catch((err) => {
                setImageUploadError("Image upload failed max image size 2mb");
                setUploading(false)
            })
        }
        else{
            setImageUploadError("You can upload only 6 images")
            setUploading(false)

        }
    }

    const storeImage = async(file) => {
        return new Promise((resolve , reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime()+file.name
            const storageRef = ref(storage , fileName)
            const uploadtask = uploadBytesResumable(storageRef , file);

            uploadtask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log(`upload is ${progress}% done`)
                }
                ,

                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadtask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    })
                }
        

            );
        })
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData , 
            imageURLs: formData.imageURLs.filter((url , i) => i!==index )
    })
    }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Add Property</h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1 '>
                <input type="text"
                placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength={62} minLength={10} required />
                <input type="text"
                placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                <input type="text"
                placeholder='Address' className='border p-3 rounded-lg' id='address' required />
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='sale' className='w-5'/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='rent' className='w-5'/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='parking' className='w-5'/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='furnished' className='w-5'/>
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='offer' className='w-5'/>
                        <span>offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input type="number" id='bedrooms' min='1'
                        className='p-3 border w-24 border-gray-300 rounded-lg' />
                        <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="number" id='bathrooms' min='1'
                        className='p-3 border  w-24 border-gray-300 rounded-lg' />
                        <p>Baths</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="number" id='regularPrice' min='1'
                        className='p-3 border w-24 border-gray-300 rounded-lg' />
                        <div className='flex flex-col items-center'>
                            <p>Regular Price</p>
                            <span className='text-sm'>{"$ / month"}</span>
                        </div>
                        
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="number" id='discountPrice' min='1'
                        className='p-3 border w-24 border-gray-300 rounded-lg' />
                        <div className='flex flex-col items-center'>
                            <p>Discounted Price</p>
                            <span className='text-sm'>{"$ / month"}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>Images:
                <span className='font-normal text-gray-600 ml-2'>The First Image Will Be The Cover (Max-6)</span>
                </p>
                <div className='flex gap-4'>
                    <input type="file" 
                    onChange={(e) => setFiles(e.target.files)}
                    id='images' accept='image/*' multiple />
                    <button
                    type='button' 
                    onClick={handleImageSubmit}
                    className='px-3 py-1 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 '>
                        {uploading ? "Uploading...": "Upload"}
                    </button>
                </div>
                <p className='text-red-700'>{imageUploadError && imageUploadError}</p>
                {formData.imageURLs.length > 0 && formData.imageURLs.map((url , index) => {
                    return(
                        <div 
                        key={url}
                        className='flex justify-between p-3 border items-center'>
                            <img src={url} alt="property" className='w-20 h-20 object-contain rounded-lg' />
                            <button 
                            type='button'
                            onClick={() => handleRemoveImage(index)}
                            className='p-3 text-red-700 rounded-lg uppercase '>Delete</button>
                        </div>
                    )
                })}
                <button className='p-3 bg-slate-700 text-white rounded-lg uppercase
                hover:opacity-90 disabled:opacity-80'>Add Property</button>
            </div>
        
            
        </form>
    </main>
  )
}

export default CreateProperty