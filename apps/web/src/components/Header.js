'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <header className="bg-navbar-green">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="text-white text-2xl font-bold">
          <Link href="/">Food For Now</Link>
        </div>
        <ul className="hidden md:flex gap-6">
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
                <Link
                  href="/logout"
                  className="text-white text-base hover:underline"
                >
                  Logout
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
