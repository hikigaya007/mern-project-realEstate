import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {Swiper , SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle';

function Listing() {

  const params = useParams();

  const [property , setProperty] = useState([]);

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
                <div className='h-[500px]' style={{background: `url(${url}) center no-repeat`}}>

                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      ) }
    </main>
  )
}

export default Listing