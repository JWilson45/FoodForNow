'use client';

import Head from 'next/head';
import { useState } from 'react';
import config from '@/config';
import { UIButton } from '@/components/ui/button';
import Label from '@/components/ui/label';
import { UICheckbox } from '@/components/ui/Checkbox';
import Input from '@/components/Input';

export default function SignInPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    showPassword: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${config.apiBaseUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        alert('Sign-in successful');
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to sign in');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Food For Now - Sign In</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <section className="w-full max-w-sm p-8 bg-black/80 border-2 border-button-blue rounded-xl shadow-custom animate-fadeIn">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Sign In
          </h2>
          {error && (
            <div className="p-3 mb-4 text-red-500 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username:</Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter username"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="password">Password:</Label>
              <Input
                id="password"
                name="password"
                type={formData.showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <UICheckbox
              id="showPassword"
              name="showPassword"
              checked={formData.showPassword}
              onChange={handleChange}
              label="Show Password"
            />
            <UIButton type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Enter'}
            </UIButton>
          </form>
        </section>
      </main>
    </>
  );
}
