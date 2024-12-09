import Head from 'next/head';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Home() {
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
      <form id="loginForm">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter username"
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter password"
          required
        />

        <label>
          <input type="checkbox" id="showPassword" />
          Show Password
        </label>

        <input type="submit" value="Enter" />
      </form>
      <Footer />
    </>
  );
}
