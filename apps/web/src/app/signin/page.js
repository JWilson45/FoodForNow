'use client';
import Head from 'next/head';
import { useState } from 'react';
import Button from '@/components/Button';
import Label from '@/components/Label';
import Input from '@/components/Input';
import Checkbox from '@/components/Checkbox';

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
    // Sign-in logic
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
            <Checkbox
              id="showPassword"
              name="showPassword"
              checked={formData.showPassword}
              onChange={handleChange}
              label="Show Password"
            />
            <Button type="submit" className="w-full">
              Enter
            </Button>
          </form>
        </section>
      </main>
    </>
  );
}
