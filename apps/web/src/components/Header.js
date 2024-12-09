'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initialize as null

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    // Optionally, render a loading state or nothing to prevent mismatches
    return null;
  }

  return (
    <header className="bg-navbar-green">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="text-white text-2xl font-bold">
          <Link href="/">Food For Now</Link>
        </div>
        <ul className="hidden md:flex gap-6">
          {/* Common Links */}
          <li>
            <Link href="/" className="text-white text-base hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/viewMeals"
              className="text-white text-base hover:underline"
            >
              View Meals
            </Link>
          </li>
          <li>
            <Link
              href="/createMeal"
              className="text-white text-base hover:underline"
            >
              Create Meal
            </Link>
          </li>
          <li>
            <Link
              href="/createIngredient"
              className="text-white text-base hover:underline"
            >
              Ingredients
            </Link>
          </li>
          <li>
            <Link
              href="/createRecipe"
              className="text-white text-base hover:underline"
            >
              Recipes
            </Link>
          </li>
          <li>
            <Link
              href="/cookbook"
              className="text-white text-base hover:underline"
            >
              Cookbook
            </Link>
          </li>
          {/* Conditional Links */}
          {!isAuthenticated ? (
            <>
              <li>
                <Link
                  href="/signup"
                  className="text-white text-base hover:underline"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/signin"
                  className="text-white text-base hover:underline"
                >
                  Sign In
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/profile"
                  className="text-white text-base hover:underline"
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-white text-base hover:underline"
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

  function handleLogout() {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    // Optionally, redirect or inform the server
  }
}

Header.propTypes = {
  // Define propTypes if there are any props passed to Header
};
