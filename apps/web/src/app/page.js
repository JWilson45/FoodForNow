// /app/page.js
'use client'; // Ensure this is at the very top

import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';
import '../styles/main.css'; // Import custom main.css

export default function LandingPage() {
  const router = useRouter();

  // Function to navigate to the sign-in page
  const navigateToSignIn = () => {
    router.push('/signin');
  };

  return (
    <>
      <Head>
        <title>Food For Now - Welcome</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Header />
      <main className="landing-container">
        <section id="hero">
          <h1>Welcome to the Future of Food</h1>
          <p>Discover, create, and enjoy meals like never before.</p>
          <button onClick={navigateToSignIn} className="signin-button">
            Get Started
          </button>
        </section>
      </main>
      <Footer />
    </>
  );
}
