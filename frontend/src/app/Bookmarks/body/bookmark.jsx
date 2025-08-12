'use client';
import React, { useEffect, useState } from 'react';
import styles from './bookmark.module.css'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const Bookmark = () => {
  const [mangaData, setMangaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router=useRouter()
  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const response = await fetch('http://localhost:5000/chapter/bookmarks',{
          method:'GET',
          credentials:'include'
        });
        const result = await response.json();
        setMangaData(result.bookmarks || []); 
      } catch (error) {
        console.error('Failed to fetch bookmarks:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookmarks();
  }, []);
     const handleClick=(id)=>{
      router.push(`/mangainfo?id=${id}`)
  }

  return (
    <div>
      <div className={styles.latestmanga}>
    {mangaData.map((src, index) => (
      <div className={styles.insidelatest} key={index} onClick={()=>handleClick(src.id)}>
        <Image
          src={src.cover}
          alt={`Image ${index + 1}`}
          width={100}
          height={200}
        />
        <div className={styles.aboutManga}>
          <div className={styles.top}>
              <div className={styles.statusWrapper}>
              <div className={styles.status}>
                {src.status}
              </div>
          </div>
          {src.contentRating !== "safe" ? <div className={styles.safeWrapper}>
              <div className={styles.status}>
                {src.contentRating}
              </div>
          </div>:<></>}
          </div>
        {/*  */}
         
        <div style={{marginLeft:'5px',marginTop:'6px'}}>{src.year}{src.lastChapter===""?null : <> ~ {src.lastChapter} chapters</>}</div>
        <h3 style={{marginLeft:'5px',marginTop:'6px',height:'80px',overflowY:'hidden'}}> {src.title}</h3>
        <div className={styles.allGenre}>{src.genre.map((genr,index)=>(<div key={index} className={styles.genre}>{genr}</div>))}</div>
        </div>
      </div>
    ))}
  </div>
  
    </div>
  );
};

export default Bookmark;
