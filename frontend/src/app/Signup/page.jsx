'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./signup.module.css";
import Link from "next/link";
const SignUpForm = () => {
    const router= useRouter()
   const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include',
    });
          const resBody=await response.json()

    if (response.ok) {
      setFormData({
    name: "",
    email: "",
    password: "",
  });   
      alert('User Created Successfully')
      router.push('./Login');
      } 
      else if(response.status===409){
        alert(resBody.message);
      }
      else {
      console.error('Signup error:', resBody.message);
      // show error message to user
    }
  } catch (err) {
    console.error('Network error:', err);
    // show network error message to user
  }
};

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign Up</h2>
       <form onSubmit={handleSubmit} className={styles.form}>
  <label>Full Name</label>
  <input
    name="name"
    type="text"
    placeholder="Jane Doe"
    value={formData.name}
    onChange={handleChange}
    required
  />
  <label>Email</label>
  <input
    name="email"
    type="email"
    placeholder="you@example.com"
    value={formData.email}
    onChange={handleChange}
    required
  />
  <label>Password</label>
  <input
    name="password"
    type="password"
    placeholder="••••••••"
    value={formData.password}
    onChange={handleChange}
    required
  />
  <button type="submit">Create Account</button>
</form>
 <p className={styles.footer}>
          Already have an account? <Link href="./Login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
