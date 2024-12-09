export default function Textarea({
  id,
  name,
  value,
  onChange,
  placeholder = '',
}) {
  return (
    <textarea
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="form-textarea"
    ></textarea>
  );
}
