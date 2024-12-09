export default function Select({
  id,
  name,
  value,
  onChange,
  children,
  className = '',
  ...props
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={`form-input ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
