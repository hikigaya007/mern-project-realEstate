import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {Swiper , SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import {useSelector} from 'react-redux'
import Contact from '../components/Contact';

function Listing() {

  const params = useParams();

  const {currentUser} = useSelector((state) => state.user)

  const [property , setProperty] = useState([]);

  const [contact , setContact] = useState(false)

  const [copied , setCopied] = useState(false);

  const [loading , setLoading] = useState(true);

  const [error , setError] = useState(false);

  SwiperCore.use([Navigation])

  useEffect(() => {

    const fetchProperty = async() => {
      
      try {

        setLoading(true)
        const listingId = params.listingId ;
          
        const res = await fetch(`/api/listing/get/${listingId}`);

        const data = await res.json();

        if(data.success === false){
          console.log( data.message)
          setError(true)
          setLoading(false)
          return;
        }
        setProperty(data);
        setLoading(false)
        setError(false)

      } catch (error) {
        setError(true)
        setLoading(false)
      }
    
    } 

    fetchProperty();

  } ,[params.listingId])

  return (
    <main>
      {loading && <p className='text-center text-2xl my-7'>Loading...</p>}
      {error && <p className='text-center text-2xl my-7'>Something went wrong !!!</p>}
      {property && !loading && !error && (
       
      <div>
        <Swiper navigation >
          {property.imageURLs.map((url) => {
            return(
              <SwiperSlide key={url}>
                <div className='h-[500px]' style={{background: `url(${url}) center no-repeat` ,backgroundSize: 'cover' }}>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      ) }

      <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
      </div>
      {copied && (
        <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
           Link copied!
          </p>
        )}
        
        <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
          <p className='text-2xl font-semibold'>
                {property.name} - ${' '}
                {property.offer
                  ? property.discountedPrice
                  : property.regularPrice}
                {property.type === 'rent' && ' / month'}
          </p>
          <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {property.address}
          </p>

          <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {property.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {property.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+property.regularPrice - +property.discountedPrice} OFF
                </p>
              )}
          </div>
          <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {property.description}
          </p>
          <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {property.bedrooms > 1
                  ? `${property.bedrooms} beds `
                  : `${property.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {property.bathrooms > 1
                  ? `${property.bathrooms} baths `
                  : `${property.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {property.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {property.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && property.userRef !== currentUser._id && 
            !contact && 
            <button 
            onClick={() => setContact(true)}
            className='bg-slate-700 text-white p-3 rounded-lg'>Contact Landlord</button>}
            {contact && <Contact listing={property}/>}
        </div>
    </main>
  )
}

export default Listing