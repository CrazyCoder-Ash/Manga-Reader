'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { usePopManga } from '@/app/with-navbar/PopMangaContext'
import styles from './Popmanga.module.css';

import { Pagination, Navigation } from 'swiper/modules';

export default function Popmanga() {
  const [swiperRef, setSwiperRef] = useState(null); // <-- add this
  // const [mangaData,setMangaData] = useState([]);
  const router = useRouter();
  const popManga = usePopManga();
  // useEffect(()=>{
  //    async function loadcover() {
  //   const res=await fetch('http://localhost:5000/rating')
  //   const data = await res.json();
  //   setMangaData(data);
  // }
  // loadcover();
  // },[])

  const handleClick=(id)=>{
     router.push(`/mangainfo?id=${id}`);
  }

  return (
    <div className={styles.swiperOverride}>
    <h2>POPULAR MANGA:</h2>

      <Swiper
        slidesPerView={7}
        centeredSlides={false}
        spaceBetween={10}
        pagination={{
          type: 'fraction',
        }}
        navigation={true}
        modules={[Navigation]}
        className={styles.mySwiper}
        style={{  cursor: 'pointer'}}
      >
             {popManga.slice(0,40).map((src, index) => (
                 <SwiperSlide className={styles.hover}>
                     <Image
          key={index}
          src={src.cover}
          alt={`Image ${index + 1}`}
          width={200}
          height={200}
          onClick={()=>(handleClick(src.id))}
        />  
          <h3 style={{width:'200px',overflow: 'hidden',textOverflow: 'ellipsis',
whiteSpace: 'nowrap'
}}>{src.title}</h3>
                 </SwiperSlide>
       
      ))}
       
    
      </Swiper>
    </div>
  );
}
