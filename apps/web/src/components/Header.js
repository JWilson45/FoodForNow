'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import config from '@/config'; // Ensure this path is correct

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    async function checkLogin() {
      try {
        const res = await fetch(`${config.apiBaseUrl}/users/check`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setUser(null);
        localStorage.removeItem('user');
      }
    }

    checkLogin();
  }, []);

  function handleLogout() {
    setUser(null);
    localStorage.removeItem('user');
  }

  return (
    <header
      className="bg-primary-blue shadow-md sticky top-0 z-50"
      role="banner"
      aria-label="Site Header"
    >
      <nav
        className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo Placeholder as Home Link */}
        <div className="text-white text-2xl font-bold">
          <Link href="/" aria-label="Food For Now Home">
            Food For Now
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex gap-6 items-center">
          <li>
            <Link
              href="/viewMeals"
              className="text-white text-base hover:underline"
            >
              Explore Meals
            </Link>
          </li>
          <li>
            <Link
              href="/createMeal"
              className="text-white text-base hover:underline"
            >
              Add Meal
            </Link>
          </li>
          <li>
            <Link
              href="/createIngredient"
              className="text-white text-base hover:underline"
            >
              Add Ingredients
            </Link>
          </li>
          <li>
            <Link
              href="/createRecipe"
              className="text-white text-base hover:underline"
            >
              Add Recipes
            </Link>
          </li>
          <li>
            <Link
              href="/cookbook"
              className="text-white text-base hover:underline"
            >
              My Cookbook
            </Link>
          </li>

          {/* User Authentication Section */}
          {!user ? (
            <>
              <li>
                <Link
                  href="/signup"
                  className="text-white text-base font-semibold bg-button-blue hover:bg-button-blue-hover px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/signin"
                  className="text-white text-base font-semibold bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Sign In
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <span
                  className="text-white text-base font-semibold"
                  aria-label={`Logged in as ${user.username}`}
                >
                  {user.username}
                </span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-white text-base font-semibold bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
