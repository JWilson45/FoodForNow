// /app/signin/page.js
'use client';

import Head from 'next/head';
import { useState } from 'react';

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
    // Your login logic
    console.log('Form Data:', formData);
  };

  return (
    <>
      <Head>
        <title>Food For Now - Sign In</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className="flex items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <section className="w-full max-w-sm p-8 bg-black/80 border-2 border-blue-500 rounded-xl shadow-[0_0_10px_rgba(0,122,255,0.4),0_0_30px_rgba(0,122,255,0.4)] animate-fadeIn">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-gray-300 font-semibold"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 bg-[#333] text-white rounded-lg border border-[#555] outline-none focus:bg-[#444] focus:shadow-[0_0_10px_rgba(0,122,255,0.7),0_0_20px_rgba(0,122,255,0.7)] transition-shadow"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-gray-300 font-semibold"
              >
                Password:
              </label>
              <input
                type={formData.showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-[#333] text-white rounded-lg border border-[#555] outline-none focus:bg-[#444] focus:shadow-[0_0_10px_rgba(0,122,255,0.7),0_0_20px_rgba(0,122,255,0.7)] transition-shadow"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                name="showPassword"
                checked={formData.showPassword}
                onChange={handleChange}
                className="mr-2"
              />
              <label
                htmlFor="showPassword"
                className="text-gray-300 cursor-pointer"
              >
                Show Password
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold uppercase rounded-lg transition-transform transform hover:scale-105 active:scale-100 shadow-[0_0_10px_rgba(0,122,255,0.4),0_0_20px_rgba(0,122,255,0.4)] hover:shadow-[0_0_20px_rgba(0,122,255,0.7),0_0_40px_rgba(0,122,255,0.7)]"
            >
              Enter
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
