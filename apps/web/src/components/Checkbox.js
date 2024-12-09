export default function Checkbox({ id, name, checked, onChange, label }) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
      <label htmlFor={id} className="text-gray-300 cursor-pointer">
        {label}
      </label>
    </div>
  );
}
