// Header.js

import Link from 'next/link';
import '../styles/header.css'; // Correct CSS import based on file structure

export default function Header() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link href="/">Food For Now</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/viewMeals">View Meals</Link>
        </li>
        <li>
          <Link href="/createMeal">Create Meal</Link>
        </li>
        <li>
          <Link href="/createIngredient">Ingredients</Link>
        </li>
        <li>
          <Link href="/createRecipe">Recipes</Link>
        </li>
        <li>
          <Link href="/cookbook">Cookbook</Link>
        </li>
        <li>
          <Link href="/signup">Sign Up</Link>
        </li>
        <li id="user-display"></li>
      </ul>
    </nav>
  );
}
