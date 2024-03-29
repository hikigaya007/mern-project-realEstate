import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate , useParams } from 'react-router-dom';

function UpdateListing() {
    const {currentUser} = useSelector((state) => state.user)

    const  navigate = useNavigate();

    const params = useParams();
    

    const [files , setFiles] = useState([]);
    const [formData , setFormData] = useState({
        imageURLs: [],
        name: "",
        description:"",
        address: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 0,
        discountedPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
        
    })

    console.log(formData)
    const[uploading , setUploading] = useState(false);

    const [imageUploadError , setImageUploadError ] = useState(false);

    const [error , setError] = useState(false)

    const [loading , setLoading] = useState(false)

    useEffect (() => {
        const fetchProperty = async() => {
            const listingId = params.listingId ;
            
            const res = await fetch(`/api/listing/get/${listingId}`);

            const data = await res.json();

            console.log("checking ,,,," , data)

            if(data.success === false){
                console.log( data.message)
                return;
            }

            setFormData(data);
            console.log("checking formdata" , formData)
        }
        fetchProperty();
    } ,[]);
    
    
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

    const handleChange = (e) => {
        const { id, checked, value } = e.target;
      
        if (id === 'sale' || id === 'rent') {
          setFormData({
            ...formData,
            type: id,
          });
        } else if (id === 'parking' || id === 'furnished' || id === 'offer') {
          setFormData({
            ...formData,
            [id]: checked,
          });
        } else {
          setFormData({
            ...formData,
            [id]: value,
          });
        }
      };
      

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (formData.imageURLs.length < 1)
            return setError('You must upload at least one image');
          if (+formData.regularPrice < +formData.discountedPrice)
            return setError('Discount price must be lower than regular price');
          setLoading(true);
          setError(false);
          const res = await fetch(`/api/listing/update/${params.listingId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              userRef: currentUser._id,
            }),
          });
          const data = await res.json();
          setLoading(false);
          if (data.success === false) {
            setError(data.message);
          }
          navigate(`/listing/${data._id}`);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };

    


  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Update Property</h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1 '>
                <input type="text"
                value={formData.name}
                placeholder='Name'
                onChange={(e) => setFormData({...formData , name: e.target.value})}
                className='border p-3 rounded-lg' id='name' maxLength={62} minLength={10} required />
                <input type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData , description: e.target.value})}
                placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                <input type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData , address: e.target.value})}
                placeholder='Address' className='border p-3 rounded-lg' id='address' required />
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input 
                        onChange={handleChange}
                        checked={formData.type === 'sale'}
                        type="checkbox" id='sale' className='w-5'/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox"
                        onChange={handleChange}
                        checked={formData.type === 'rent'}
                        id='rent' className='w-5'/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" 
                        checked={formData.parking}
                        onChange={handleChange}
                        id='parking' className='w-5'/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox"
                        checked={formData.furnished}
                        onChange={handleChange}
                        id='furnished' className='w-5'/>
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" 
                        checked={formData.offer}
                        onChange={handleChange}
                        id='offer' className='w-5'/>
                        <span>offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input 
                        onChange={(e) => setFormData({...formData , bedrooms: e.target.value})}
                        type="number"
                        value={formData.bedrooms}
                        id='bedrooms' min='1'
                        className='p-3 border w-24 border-gray-300 rounded-lg' />
                        <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input 
                        onChange={(e) => setFormData({...formData , bathrooms: e.target.value})}
                        value={formData.bathrooms}
                        type="number" id='bathrooms' min='1'
                        className='p-3 border  w-24 border-gray-300 rounded-lg' />
                        <p>Baths</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input 
                        onChange={(e) => setFormData({...formData , regularPrice: e.target.value})}
                        type="number"
                        value={formData.regularPrice}
                        id='regularPrice' min='1'
                        className='p-3 border w-24 border-gray-300 rounded-lg' />
                        <div className='flex flex-col items-center'>
                            <p>Regular Price</p>
                            <span className='text-sm'>{"$ / month"}</span>
                        </div>
                        
                    </div>
                    {formData.offer && 
                    <div className='flex items-center gap-2'>
                        <input type="number"
                        value={formData.discountedPrice} 
                        onChange={(e) => setFormData({...formData , discountedPrice: e.target.value})}
                        id='discountPrice' min='0'
                        className='p-3 border w-24 border-gray-300 rounded-lg' />
                        <div className='flex flex-col items-center'>
                            <p>Discounted Price</p>
                            <span className='text-sm'>{"$ / month"}</span>
                        </div>
                    </div>}
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
                <button
                disabled={loading || uploading}
                onClick={handleSubmit}
                className='p-3 bg-slate-700 text-white rounded-lg uppercase
                hover:opacity-90 disabled:opacity-80'>{loading?"Updating...": "Update Property"}</button>
                {error && <p className='text-red-700 text-sm'>{error}</p>}
            </div>
        
            
        </form>
    </main>
  )
}

export default UpdateListing