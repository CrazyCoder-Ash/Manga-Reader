import React from 'react'
import styles from './SearchResults.module.css'
import { useRouter } from 'next/navigation'
const SearchResults = ({results}) => {
  const router = useRouter()
  const handleClick=async(id)=>{
        router.push(`/mangainfo?id=${id}`)
  }
  return (
    <div className={styles.resultsList}>
        {
            results.map((result,id)=>{
                return <div key={result.id}  onClick={()=>handleClick(result.id)}>{result.title}</div>
            })
        }
    </div>
  )
}

export default SearchResults