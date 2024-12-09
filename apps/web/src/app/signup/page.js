'use client';
import Head from 'next/head';
import { useState } from 'react';
import Button from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';
import Label from '@/components/Label';
import Input from '@/components/Input';

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
    // Signup logic
  };

  const togglePasswordVisibility = (show) => {
    const passField = document.getElementById('password');
    if (passField) passField.type = show ? 'text' : 'password';
  };

  return (
    <>
      <Head>
        <title>Sign Up - Food For Now</title>
      </Head>
      <main className="flex justify-center items-center p-6 bg-gray-900 min-h-screen">
        <form
          id="signupForm"
          onSubmit={handleSubmit}
          autoComplete="on"
          className="w-full max-w-lg bg-black/80 border-2 border-button-blue rounded-xl p-8 shadow-custom animate-fadeIn"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Sign Up
          </h2>
          <div className="mb-4">
            <Label htmlFor="firstName">First Name:</Label>
            <Input
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="lastName">Last Name:</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="username">Username:</Label>
            <Input
              id="username"
              name="username"
              required
              minLength={3}
              maxLength={30}
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password:</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="showSignupPassword"
              onChange={(e) => togglePasswordVisibility(e.target.checked)}
              className="mr-2"
            />
            <label
              htmlFor="showSignupPassword"
              className="text-gray-300 cursor-pointer"
            >
              Show Password
            </label>
          </div>
          <div className="mb-4">
            <ProgressBar value={0} strength="weak" />
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email:</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="dateOfBirth">Date of Birth:</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
            />
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </main>
    </>
  );
}
