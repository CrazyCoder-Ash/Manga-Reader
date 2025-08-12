'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import styles from './chapter.module.css'
const Chapter = () => {
    const searchParams = useSearchParams(); 
    const chapId = searchParams.get('chapId');
    const [imageData,setImageData]=useState([]);
    useEffect(()=>{
        async function chapPages() {
            const res=await fetch(`http://localhost:5000/chapter/${chapId}`)
            const data=await res.json();
            setImageData(data);
        }
        chapPages()
    },[])
  return (
    <div className={styles.container}>
      {imageData.map((src, index) => (
        <div className={styles.imageWrapper} key={index}>
          <img
            src={src}
            alt={`Image ${index + 1}`}
            className={styles.chapterImage}
            loading="lazy"
            style={{ width:'100%',height:'100%',objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  )
}

export default Chapter