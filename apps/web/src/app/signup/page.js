'use client';
import Head from 'next/head';
import { useState } from 'react';
import config from '@/config';
import Button from '@/components/Button';
import Label from '@/components/Label';
import Input from '@/components/Input';
import ProgressBar from '@/components/ProgressBar';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    dateOfBirth: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Calculate password strength if password field is being updated
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password) => {
    if (password.length > 12) return 3; // Strong
    if (password.length > 8) return 2; // Medium
    return 1; // Weak
  };

  const togglePasswordVisibility = (show) => {
    const passField = document.getElementById('password');
    if (passField) passField.type = show ? 'text' : 'password';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Here we can use Joi or a simple check based on the validator.js schema
      const response = await fetch(`${config.apiBaseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Sign Up failed');
        return;
      }

      const data = await response.json();
      setSuccessMessage('Sign Up successful! Welcome to Food For Now!');
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        email: '',
        dateOfBirth: '',
      });
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
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

          {error && (
            <div className="p-3 mb-4 text-red-500 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3 mb-4 text-green-500 bg-green-100 rounded-lg">
              {successMessage}
            </div>
          )}

          <div className="mb-4">
            <Label htmlFor="firstName">First Name:</Label>
            <Input
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="lastName">Last Name:</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
            <ProgressBar
              value={passwordStrength}
              strength={['weak', 'medium', 'strong'][passwordStrength - 1]}
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="email">Email:</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="dateOfBirth">Date of Birth:</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
      </main>
    </>
  );
}
