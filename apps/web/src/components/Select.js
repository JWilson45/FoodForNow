export default function Select({ id, name, value, onChange, children }) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="form-input"
    >
      {children}
    </select>
  );
}
