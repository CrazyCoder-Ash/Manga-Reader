'use client'
import React, { useState ,useRef , useEffect} from 'react'
import {FaSearch} from 'react-icons/fa';
import styles from './Searchbar.module.css'
import Search from './Search/search';
import SearchResults from './searchresults/SearchResults';
const Searchbar = () => {
    const [results,setResults]=useState([])
        const [input,setInput]=useState("")
                 const inputRef = useRef(null);

      const [isOpen, setIsOpen] = useState(false)
            const wrapperRef = useRef(null); 

    useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        inputRef.current?.blur();
                      setInput("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
    const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      inputRef.current?.blur();
              setInput("")

    }

  };
  return (
    <div className={styles.totalWrapper} ref={wrapperRef}>
        <Search setResults={setResults} input={input} setInput={setInput} isOpen={isOpen} setIsOpen={setIsOpen} inputRef={inputRef} handleKeyDown={handleKeyDown}/>
        {input===""?null:<SearchResults results={results}/>}
    </div>

  )
}

export default Searchbar
