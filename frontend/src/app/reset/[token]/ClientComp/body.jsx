'use client'

import React , {useState} from 'react'
import styles from './body.module.css'
import { redirect } from 'next/dist/server/api-utils'
import { useRouter } from 'next/navigation'

const body = ({token}) => {
    const router=useRouter()
     const [loginData,setLogin]=useState({
        newPassword: "",
        confirmpassword: ""
      })
       const handleChange = (e) => {
        setLogin({ ...loginData, [e.target.name]: e.target.value });
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        if(loginData.newPassword !== loginData.confirmpassword){
            alert('passwords do not match')
        }
        try {
            const response=await fetch(`http://localhost:5000/changePassword/${token}`,{
                method:'POST',
                credentials:'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: loginData.newPassword })
            });
           const data= response.json()

           router.push('/Login');
            
        } catch (error) {
            console.log(error)
        }
};
  return (
    <div className={styles.loginBody}>
      <div className={styles.loginContainer}>
        <h2 className={styles.loginTitle}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="newpassword" className={styles.formLabel}>New Password</label>
            <input
              type="password"
              name="newPassword"
              required
              placeholder="Enter your password"
              value={loginData.newPassword}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmpassword" className={styles.formLabel}>Confirm Password</label>
            <input
              type="password"
              name="confirmpassword"
              required
              placeholder="Enter your password"
              value={loginData.confirmpassword}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          <button type="submit" className={styles.loginButton}>Login</button>
        </form>
      </div>
    </div>
  )
}

export default body