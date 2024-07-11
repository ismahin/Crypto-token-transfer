export function TextInput({ value, setState, placeholder }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setState(e.target.value)}
    />
  );
}
