// Header.js
import Link from 'next/link';

export default function Header() {
  return (
    <nav>
      <ul>
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
          <Link href="/ingredients">Ingredients</Link>
        </li>
        <li>
          <Link href="/recipes">Recipes</Link>
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
