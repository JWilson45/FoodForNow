export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-10">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <p>&copy; 2024 FoodForNow. All Rights Reserved.</p>
        <div className="flex gap-4">
          <a href="#home" className="hover:underline">
            Back to Top
          </a>
          <a
            href="https://github.com/JWilson45/FoodForNow"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
