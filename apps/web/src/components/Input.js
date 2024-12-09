export default function Input({
  id,
  name,
  type = 'text',
  required = false,
  value,
  onChange,
  placeholder = '',
}) {
  return (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      className="form-input"
    />
  );
}
