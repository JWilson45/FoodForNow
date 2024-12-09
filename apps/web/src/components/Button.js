'use client';
import { useRouter } from 'next/navigation';

export default function Button({
  children,
  onClick,
  type = 'button',
  className = '',
  href,
}) {
  const router = useRouter();
  const handleClick = (e) => {
    if (href) {
      e.preventDefault();
      router.push(href);
    }
    if (onClick) {
      onClick(e);
    }
  };
  return (
    <button
      type={type}
      onClick={handleClick}
      className={`px-4 py-2 bg-button-blue hover:bg-button-blue-hover active:bg-button-blue-active text-white font-bold uppercase rounded-lg transition-transform transform hover:scale-105 active:scale-100 shadow-custom hover:shadow-custom-hover ${className}`}
    >
      {children}
    </button>
  );
}
