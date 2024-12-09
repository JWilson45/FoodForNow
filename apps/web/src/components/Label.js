export default function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block mb-2 text-gray-300 font-semibold">
      {children}
    </label>
  );
}
