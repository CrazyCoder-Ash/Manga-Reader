'use client'
import React, {useEffect , useState }from 'react'
import styles from '../completed.module.css'
import Image from 'next/image';
import { usePopManga } from '@/app/with-navbar/PopMangaContext'
import { useRouter } from 'next/navigation';
const Latestmanga = () => {
    const router=useRouter()
    const popManga=usePopManga()
    const [mangaData,setMangaData]=useState([]);
    useEffect(()=>{
            async function loadcover() {
    const res=await fetch('http://localhost:5000/completed')
    const data = await res.json();
    setMangaData(data);
  }
  loadcover();
    },[])
  const handleClick=(id)=>{
      router.push(`/mangainfo?id=${id}`)
  }
  return ( 
    <div><h1>COMPLETED MANGA</h1>
      <div className={styles.main}>
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
   <div className={styles.listWrapper}>

{
  popManga.slice(20,40).map((src,key)=>(<div className={styles.list} key={key} onClick={handleClick.bind(this,src.id)}><p>{src.title}</p></div>
  ))
}

  </div>
</div>
    </div>

  )
}


export default Latestmanga