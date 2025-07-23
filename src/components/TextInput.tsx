interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function TextInput({ label, className, ...props }: Props) {
  return (
    <label style={{ fontWeight: 600, display: "block" }}>
      {label}
      <input {...props} className={className} />
    </label>
  );
}
