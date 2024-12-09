'use client';

import Head from 'next/head';
import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    dateOfBirth: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert('Signup successful!');
      window.location.href = '/';
    } else {
      const errorData = await res.json();
      alert(errorData.error || 'Error during signup.');
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - Food For Now</title>
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
      <form id="signupForm" onSubmit={handleSubmit} autoComplete="on">
        <h2>Sign Up</h2>

        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          required
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
        />

        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
        />

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          required
          minLength="3"
          maxLength="30"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          minLength="8"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <div>
          <label htmlFor="showSignupPassword">
            <input
              type="checkbox"
              id="showSignupPassword"
              onChange={(e) => {
                const passField = document.getElementById('password');
                passField.type = e.target.checked ? 'text' : 'password';
              }}
            />
            Show Password
          </label>
        </div>

        <div className="progress-bar-container">
          <div id="progressBar" className="progress-bar"></div>
        </div>

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <label htmlFor="dateOfBirth">Date of Birth:</label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={(e) =>
            setFormData({ ...formData, dateOfBirth: e.target.value })
          }
        />

        <button type="submit" className="submit">
          Sign Up
        </button>
      </form>
      <Footer />
    </>
  );
}
