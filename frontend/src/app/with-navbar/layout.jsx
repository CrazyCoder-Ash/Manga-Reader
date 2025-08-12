'use client'

import React, {useEffect , useState }from 'react'
import Navbar from "../NavBar/Navbar";
import Popmanga from "../PopManga/Popmanga";
import styles from './mainstyles.module.css';
import { PopMangaContext } from './PopMangaContext';

export default function WithNavbarLayout({ children }) {
  const [popManga,setPopManga]=useState([]);
 

    useEffect(()=>{
              async function popname() {
      const res=await fetch('http://localhost:5000/rating')
      const data = await res.json();
      setPopManga(data);
    }
    popname();
      },[])
         console.log('Passing to child:', popManga);
  return (
    <div className={styles.mainWrapper}>
      <Navbar/>
      
       <PopMangaContext.Provider value={popManga}>
        <Popmanga/>
        {children}
      </PopMangaContext.Provider>
    </div>
  );
}