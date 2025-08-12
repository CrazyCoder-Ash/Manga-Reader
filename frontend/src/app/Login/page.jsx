"use client"
import React, { useState } from "react";
import styles from "./login.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
const LoginForm = () => {
  const router=useRouter();
  const [loginData,setLogin]=useState({
    email: "",
    password: ""
  })
   const handleChange = (e) => {
    setLogin({ ...loginData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
      
  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
      credentials: 'include',
    });
    const resBody=await response.json()

    if (response.ok) {
      setLogin({
    email: "",
    password: "",
  });   
      alert('User LoggedIn Successfully')
      router.push('/');
      } 
      else if(response.status===409){
        alert(resBody.message);
      }
      else {
      console.error('Signup error:', resBody.message);
    }
  } catch (err) {
    console.error('Network error:', err);
    
  }
    };

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
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          <button type="submit" className={styles.loginButton}>Login</button>
        </form>
        <div className={styles.footerText}>
          Don't have an account? <Link href="./Signup" className={styles.signupLink}>Sign up</Link>
        <div>        <Link href="./ChangePassword" className={styles.signupLink}>Forgot password?</Link>    
</div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
