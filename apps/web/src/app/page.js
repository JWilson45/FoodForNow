'use client'; // Add this line at the very top

import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import '../styles/main.css'; // Import custom main.css

export default function Home() {
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
        <title>Food For Now</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Header />
      <header id="home">
        <h1>
          <span id="easter-egg" title="Click me!">
            F
          </span>
          ood For Now
        </h1>
        <p>Welcome to the future of food.</p>
      </header>
      <form id="loginForm" onSubmit={handleSubmit} className="container forms">
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

        <label>
          <input
            type="checkbox"
            id="showPassword"
            name="showPassword"
            checked={formData.showPassword}
            onChange={handleChange}
          />
          Show Password
        </label>

        <input type="submit" value="Enter" />
      </form>
      <Footer />
    </>
  );
}

// Remove any duplicate import statements below
