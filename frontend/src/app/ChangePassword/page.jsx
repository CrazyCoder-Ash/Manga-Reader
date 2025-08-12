'use client'
import React , {useState}from 'react'
import styles from './changepass.module.css'
import { useRouter } from 'next/navigation'
const page = () => {
    const router=useRouter();
      const [loginData,setLogin]=useState({
        email: ""
      })
       const handleChange = (e) => {
        setLogin({ ...loginData, [e.target.name]: e.target.value });
      };
      const handleSubmit=async()=>{
            try {
               const response = await fetch('http://localhost:5000/changePassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
      credentials: 'include'
    });
    const resBody=await response.json()
     if (response.ok) {
      setLogin({
    email: "",
  });   
    //   router.push('/');
      } 
      else if(response.status===409){
        alert(resBody.message);
      }
      else {
      console.error('Signup error:', resBody.message);
    }
            } catch (error) {
                console.log(error)
            }
      }
    

  return (
    <div className={styles.loginBody}>
      <div className={styles.loginContainer}>
        <h2 className={styles.loginTitle}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className={styles.formInput}
              value={loginData.email}
              onChange={handleChange}
            />
          </div>     
          <button type="submit" className={styles.loginButton}>Email</button>
        </form>
      </div>
    </div>
  )
}

export default page