'use client'
import React, { useState , useRef , useEffect} from 'react'
import {FaSearch} from 'react-icons/fa';
import styles from './seach.module.css'
const Search = ({setResults , input ,setInput,isOpen,setIsOpen,handleKeyDown,inputRef}) => {
    const fetchData=(value)=>{
            fetch('http://localhost:5000/manga', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: value
  })
}).then((response)=>(response.json())).then((json)=>{
                const results = (json.name || []).filter((manga)=>{
                    return manga && manga.title && manga.title.toLowerCase().includes(value.toLowerCase())
                })
                 setResults(results)
                    })
           
    }
    const handleChange=(value)=>{
        setInput(value)
        if(value!=="")
        {fetchData(value)}
    }

  
    
  return (
         <> {isOpen && <div className={styles.backdrop} onClick={() => setIsOpen(false)} />}

      <div className={`${styles.search_wrapper}`} >
                <FaSearch style={{color:'white'}}/>
                <input type="text" placeholder='Search Something' className={styles.inputWrapper} onKeyDown={handleKeyDown} ref={inputRef} value={input} onChange={(e)=>{handleChange(e.target.value)}}/>
        </div></>
        
  )
}

export default Search
