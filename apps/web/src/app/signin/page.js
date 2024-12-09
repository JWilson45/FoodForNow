// /app/signin/page.js
'use client'; // Add this line if using client-side hooks

import Head from 'next/head';
import { useState } from 'react';
import '../../styles/main.css'; // Ensure styles are applied

export default function SignInPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    showPassword: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement your login logic here
    console.log('Form Data:', formData);
  };

  return (
    <>
      <Head>
        <title>Food For Now - Sign In</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className="signin-container">
        <section id="signin-form">
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
              required
              value={formData.username}
              onChange={handleChange}
            />

            <label htmlFor="password">Password:</label>
            <input
              type={formData.showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Enter password"
              required
              value={formData.password}
              onChange={handleChange}
            />

            <label className="checkbox-label">
              <input
                type="checkbox"
                id="showPassword"
                name="showPassword"
                checked={formData.showPassword}
                onChange={handleChange}
              />
              Show Password
            </label>

            <button type="submit" className="submit-button">
              Enter
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
