'use client'
import React, {useEffect , useState }from 'react'
import styles from './Mangadetails.module.css'
import Image from 'next/image';
import dayjs from 'dayjs';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';

const Mangadetails = (props) => {
    const router=useRouter();
    const [bookmark,setBookMark]=useState(false);
    const [popManga,setPopManga]=useState([]);
    const [mangaInfo,setMangaInfo]=useState({});
    const [chapterInfo,setChapterInfo]=useState({});
    const [logIn,setLoggedIn]=useState(false);
    const id=props.id;
    const handleBookmark = async () => {
  const newStatus = !bookmark;

  const url = newStatus
    ? 'http://localhost:5000/chapter/addbookmark'
    : 'http://localhost:5000/chapter/removebookmark';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(newStatus ? 'Bookmark added:' : 'Bookmark removed:', data);
      setBookMark(newStatus); // Only update UI on success
    } else if (response.status === 401) {
  router.push('/Login'); // only redirect if user is not logged in
}else {
  console.error('Unexpected error:', data);
}
  } catch (error) {
    console.error('Fetch error:', error);
  }
};


    useEffect(()=>{
        async function manga() {
            try {
    const response = await fetch(`http://localhost:5000/mangadetails?id=${id}`);
    const abtmanga = await response.json();
    setMangaInfo(abtmanga);
} catch (error) {
    console.error('Failed to fetch manga details:', error);
  }
        }

         async function checkBookmarked() {
                try {
                     const res=await fetch(`http://localhost:5000/chapter/checkBookmark?id=${id}`,{
                      method:'GET',
                      credentials: 'include'

                     })
                    const data=await res.json()
                      setBookMark(data)
                    console.log('Check bookmark response:', data);

                } catch (error) {
                      console.log(error)
                }
           }
           async function chapterList() {
                const res=await fetch(`http://localhost:5000/chapter/manga/${id}`)
                const data=await res.json()
                setChapterInfo(data);
              }
        manga();
                  checkBookmarked();
                           chapterList();
                async function checkLogin() {
            try {
            
const res = await fetch('http://localhost:5000/api/check-session', {
  credentials: 'include'
});
const data = await res.json(); // { loggedIn: true } or { loggedIn: false }
setLoggedIn(data.isLoggedIn);

            } catch (error) {
                console.log(error)
            }
          }
          checkLogin();


    },[id])
    useEffect(()=>{
            async function popname() {  
    const res=await fetch('http://localhost:5000/rating')
    const data = await res.json();
    setPopManga(data);
  }
          
         popname();
    },[])
    
     const formattedDate = mangaInfo?.resp?.data?.attributes?.updatedAt
    ? dayjs(mangaInfo.resp.data.attributes.updatedAt).format('MMM-DD-YYYY hh:mm:ss A')
    : null;
    const synopsis=mangaInfo?.resp?.data?.attributes?.description?.en;
    const handleClick=(chapId)=>{
          router.push(`/Chapter?chapId=${chapId}`);
    }
    const handleManga=(id)=>{
      router.push(`/mangainfo?id=${id}`)
    }
  return ( 
    <div>
       <div className={styles.main}>
  <div className={styles.latestmanga}>
        <div style={{width:'100%',height:'300px',display:'flex',padding:'5px'}}>
            <div style={{width:'20%',height:'100%'}}>
              {mangaInfo.coverpic && (
  <>
    <Image
      src={mangaInfo.coverpic}
      alt="Manga Cover"
      width={140}
      height={200}
    />
     {logIn && <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
   <button
        className={bookmark ? styles.bookmarkdone : styles.bookmarkButton}
        onClick={handleBookmark}
        disabled={mangaInfo?.resp == null} // disable if manga not loaded
      >
        {bookmark ? 'Bookmarked' : 'Bookmark'}
      </button>
    </div>}
  </>
)}

                               </div>
                               
                <div style={{marginLeft:'15px'}}>
                    <h1>{mangaInfo?.resp?.data?.attributes?.title?.en}</h1>
                    <h2>
  Author(s):
  {mangaInfo?.resp?.data?.relationships
    ?.filter(rel => rel.type === 'author')
    ?.map(author => author.attributes?.name)
    ?.join(', ') || 'Unknown'}
</h2>

                    <h2>Status:{mangaInfo?.resp?.data?.attributes?.status}</h2>
                    <h2>
  Last updated:{' '}
  {
    formattedDate || 'Loading...'}
</h2>
                    <h2>Follows: {mangaInfo?.views?.follows}</h2>
                    <h2>Rating: {mangaInfo?.views?.averageRating}/10</h2>
                    <h3>Total Chapters:{chapterInfo?.totalchapter}</h3>
                </div>
                
        </div>
                   <div style={{ color: 'white', fontSize: '16px', lineHeight: '1.7' }}>
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: '#00bfff' }} />
          ),
          strong: ({ node, ...props }) => <strong style={{ color: '#ffd700' }} {...props} />,
          hr: () => <hr style={{ borderColor: '#444', margin: '20px 0' }} />,
        }}
      >
        {synopsis}
      </ReactMarkdown>
    </div>
           <div className={styles.chapdiv1}>  
             <h2>Chapter List:</h2>
          <div className={styles.chapdiv2}> 
              {
              chapterInfo?.chapter?.map((chap,index)=>(
                <div key={index} onClick={()=>handleClick(chap.id)} className={styles.chaplist} ><h4 >Chapter {chap.number}</h4></div>
              ))
            }
          </div>
           </div>
  </div>
        
               <div className={styles.listWrapper}>

{
  popManga.map((src,key)=>(<div className={styles.list} key={key} onClick={handleManga.bind(this,src.id)}><p  >{src.title}</p></div>
  ))
}

  </div>
</div>
    </div>

  )
}


export default Mangadetails