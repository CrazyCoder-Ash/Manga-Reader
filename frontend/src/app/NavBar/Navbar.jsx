'use client'
import React, { useState ,useEffect } from 'react'
import Image from 'next/image'
import styles from './Navbar.module.css'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import checkSession from '@/utils/checkSession';
import Searchbar from '../SearchBar/page';
const Navbar = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(()=>{
        checkSession().then((status)=>{
            if(status){
                setIsLoggedIn(true)
            }
        }).catch((err)=>{
            console.log(err);
            console.log('error at session check');
        })
    },[router]);
    const handleLogout = async () => {
    await fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setIsLoggedIn(false);
    router.push('/');
  };
  const handleLogin=()=>{
    router.push('/Login');
  }
   return (
   <div className={styles.outerdiv}>
      <div className={styles.div1}>
          <div className={styles.inndiv1}><div className={styles.divTitle}><span className={styles.spanTitle}> Manga Reader</span></div></div>
          <div className={styles.logindiv}>

               <div className={styles.loginWrapper}>
                {isLoggedIn ? <button >
                    <Link href="/Bookmarks">BookMark</Link>
                   </button> : <button  onClick={handleLogin}>
                    Login
                     {/* <Link href="/Login">Login</Link> */}
                   </button>}
               </div>
                  <div className={styles.loginWrapper}>
                     {isLoggedIn ? <button  onClick={handleLogout}>
                     LogOut
                   </button> :<button >
                                     <Link href="/Signup">SignUp</Link>
                   </button>}
                  </div>
          </div>
              </div>

                  <div className={styles.mainWrapper}>
                    <div className={styles.div2}>
                 <div className={styles.inndiv2}>
                  <ul>
                     <li><Link href='/with-navbar'>Home</Link></li>
                     <li><Link href='/with-navbar/ongoing'>Ongoing Manga</Link></li>
                     <li><Link href='/with-navbar/completed'>Completed Manga</Link></li>
                      
                </ul>
                 </div>
      </div>
                  </div>
           <div className={styles.searchBar}>
                  <Searchbar/>
                </div>
   </div>
  )
}

export default Navbar

// <div className={styles.outerdiv}> 
//         <div   className={styles.img}>
//              <Image src="/logo-manganato.webp"
//         width={200}
//         height={100}
//          alt="Manganato Logo"
//         />
//         </div>
       
//         <div className={styles.innerdiv1}>
//             <div className={styles.innerdiv2}>
//                 <form style={{width:'40%',height:'40%'}}>
//                     <input type="text" placeholder='Search Manga' style={{width:'100%',height:'100%'}}/>
//                 </form>
//                {isLoggedIn ? <button className={styles.button}>
//                     <Link href="/Login">BookMark</Link>
//                   </button> : <button className={styles.button}>
//                     <Link href="/Login">Login</Link>
//                   </button>}
//                   {isLoggedIn ? <button className={styles.button} onClick={handleLogout}>
//                     LogOut
//                   </button> :<button className={styles.button}>
//                                     <Link href="/Signup">Register</Link>
//                   </button>}
                  
//                </div>
//             <div className={styles.innerdiv3}>
//                 <ul>
//                     <li><Link href='/'>Home</Link></li>
//                     <li><Link href='./ongoing'>Ongoing Manga</Link></li>
//                     <li>Completed Manga</li>
//                 </ul>
//             </div>
//         </div>
//     </div>